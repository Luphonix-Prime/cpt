// Reference: Replit Auth integration blueprint
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertCaseSchema, insertEvidenceSchema } from "@shared/schema";
import { createHash } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // ==================== CUSTOM LOGIN ====================

  app.post('/api/login', async (req: any, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin') {
      // Create a simple session
      req.session.userId = 'admin-user';
      req.session.user = {
        id: 'admin-user',
        email: 'admin@forensics.local',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      };

      // Ensure user exists in database
      await storage.upsertUser({
        id: 'admin-user',
        email: 'admin@forensics.local',
        firstName: 'Admin',
        lastName: 'User',
        profileImageUrl: null
      });

      return res.json({ success: true });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  });

  app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  // ==================== AUTH ROUTES ====================

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      // Handle custom session
      if (req.session && req.session.userId) {
        const user = await storage.getUser(req.session.userId);
        if (user) {
          return res.json(user);
        }
      }

      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Log activity
      await storage.logActivity(
        userId,
        "accessed_profile",
        "user",
        userId,
        null,
        req.ip,
        req.get('user-agent')
      );

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ==================== DASHBOARD STATS ====================

  app.get('/api/stats', isAuthenticated, async (req: any, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // ==================== ROLE CHECK MIDDLEWARE ====================

  const requireRole = (allowedRoles: string[]) => {
    return async (req: any, res: any, next: any) => {
      try {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);

        if (!user || !allowedRoles.includes(user.role)) {
          return res.status(403).json({ message: "Insufficient permissions" });
        }

        next();
      } catch (error) {
        res.status(500).json({ message: "Error checking permissions" });
      }
    };
  };

  // ==================== CASE MANAGEMENT ====================

  app.get('/api/cases', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cases = await storage.getCases();

      // Log activity
      await storage.logActivity(
        userId,
        "viewed_cases",
        "case",
        undefined,
        { count: cases.length },
        req.ip,
        req.get('user-agent')
      );

      res.json(cases);
    } catch (error) {
      console.error("Error fetching cases:", error);
      res.status(500).json({ message: "Failed to fetch cases" });
    }
  });

  app.get('/api/cases/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const caseItem = await storage.getCase(req.params.id);

      if (!caseItem) {
        return res.status(404).json({ message: "Case not found" });
      }

      // Log activity
      await storage.logActivity(
        userId,
        "viewed_case",
        "case",
        caseItem.id,
        { caseNumber: caseItem.caseNumber },
        req.ip,
        req.get('user-agent')
      );

      res.json(caseItem);
    } catch (error) {
      console.error("Error fetching case:", error);
      res.status(500).json({ message: "Failed to fetch case" });
    }
  });

  app.post('/api/cases', isAuthenticated, requireRole(['admin', 'analyst']), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate request body
      const validatedData = insertCaseSchema.parse({
        ...req.body,
        createdById: userId,
      });

      const newCase = await storage.createCase(validatedData);

      // Log activity
      await storage.logActivity(
        userId,
        "created_case",
        "case",
        newCase.id,
        { caseNumber: newCase.caseNumber, title: newCase.title },
        req.ip,
        req.get('user-agent')
      );

      res.status(201).json(newCase);
    } catch (error: any) {
      console.error("Error creating case:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid case data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create case" });
    }
  });

  app.patch('/api/cases/:id/status', isAuthenticated, requireRole(['admin', 'analyst', 'supervisor']), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const updatedCase = await storage.updateCaseStatus(req.params.id, status);

      // Log activity
      await storage.logActivity(
        userId,
        "updated_case_status",
        "case",
        updatedCase.id,
        { caseNumber: updatedCase.caseNumber, newStatus: status },
        req.ip,
        req.get('user-agent')
      );

      res.json(updatedCase);
    } catch (error) {
      console.error("Error updating case status:", error);
      res.status(500).json({ message: "Failed to update case status" });
    }
  });

  // ==================== EVIDENCE MANAGEMENT ====================

  app.get('/api/evidence', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const caseId = req.query.caseId as string | undefined;
      const evidenceList = await storage.getEvidence(caseId);

      // Log activity
      await storage.logActivity(
        userId,
        "viewed_evidence",
        "evidence",
        undefined,
        { caseId, count: evidenceList.length },
        req.ip,
        req.get('user-agent')
      );

      res.json(evidenceList);
    } catch (error) {
      console.error("Error fetching evidence:", error);
      res.status(500).json({ message: "Failed to fetch evidence" });
    }
  });

  app.post('/api/evidence', isAuthenticated, requireRole(['admin', 'analyst']), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      // For MVP, we'll accept evidence data with file info
      // In production, this would handle file uploads via multipart/form-data
      const { caseId, evidenceNumber, type, fileName, fileContent, description, collectedAt } = req.body;

      if (!caseId || !evidenceNumber || !type || !fileName) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Generate SHA-256 hash (in production, this would be from actual file)
      const hash = createHash('sha256');
      hash.update(fileContent || fileName);
      const sha256Hash = hash.digest('hex');

      const evidenceData = {
        caseId,
        evidenceNumber,
        type,
        fileName,
        fileSize: fileContent?.length || 0,
        filePath: `/evidence/${caseId}/${fileName}`,
        sha256Hash,
        description,
        collectedBy: userId,
        collectedAt: collectedAt ? new Date(collectedAt) : new Date(),
      };

      const newEvidence = await storage.createEvidence(evidenceData);

      // Add chain of custody entry
      await storage.addCustodyEntry({
        evidenceId: newEvidence.id,
        action: "collected",
        userId,
        timestamp: new Date(),
        location: "Evidence Collection Site",
        notes: "Initial evidence collection",
        ipAddress: req.ip,
      });

      // Log activity
      await storage.logActivity(
        userId,
        "uploaded_evidence",
        "evidence",
        newEvidence.id,
        { evidenceNumber, fileName, caseId },
        req.ip,
        req.get('user-agent')
      );

      res.status(201).json(newEvidence);
    } catch (error: any) {
      console.error("Error creating evidence:", error);
      res.status(500).json({ message: "Failed to upload evidence" });
    }
  });

  // ==================== ANALYSIS RESULTS ====================

  app.post('/api/analysis', isAuthenticated, requireRole(['admin', 'analyst']), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { caseId, evidenceId, moduleType, analysisType, results, confidence, flagged } = req.body;

      if (!caseId || !moduleType || !analysisType || !results) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      await storage.createAnalysisResult({
        caseId,
        evidenceId,
        moduleType,
        analysisType,
        results,
        confidence,
        flagged,
        analyzedBy: userId,
        analyzedAt: new Date(),
      });

      // Log activity
      await storage.logActivity(
        userId,
        "performed_analysis",
        "analysis",
        evidenceId,
        { moduleType, analysisType, caseId },
        req.ip,
        req.get('user-agent')
      );

      res.status(201).json({ message: "Analysis result saved successfully" });
    } catch (error) {
      console.error("Error saving analysis:", error);
      res.status(500).json({ message: "Failed to save analysis result" });
    }
  });

  // ==================== AUDIT LOGS ====================

  app.get('/api/audit-logs', isAuthenticated, requireRole(['admin', 'auditor']), async (req: any, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await storage.getAuditLogs(limit);

      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // ==================== CHAIN OF CUSTODY ====================

  app.get('/api/evidence/:id/custody', isAuthenticated, requireRole(['admin', 'analyst', 'supervisor']), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const custodyChain = await storage.getCustodyChain(req.params.id);

      // Log activity
      await storage.logActivity(
        userId,
        "viewed_custody_chain",
        "evidence",
        req.params.id,
        null,
        req.ip,
        req.get('user-agent')
      );

      res.json(custodyChain);
    } catch (error) {
      console.error("Error fetching custody chain:", error);
      res.status(500).json({ message: "Failed to fetch custody chain" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
