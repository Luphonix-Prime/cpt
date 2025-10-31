// Reference: Replit Auth and PostgreSQL database integration blueprints
import {
  users,
  cases,
  evidence,
  chainOfCustody,
  analysisResults,
  auditLogs,
  type User,
  type UpsertUser,
  type Case,
  type InsertCase,
  type Evidence,
  type InsertEvidence,
  type InsertChainOfCustody,
  type InsertAnalysisResult,
  type AuditLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (Required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Case operations
  getCases(): Promise<Case[]>;
  getCase(id: string): Promise<Case | undefined>;
  createCase(caseData: InsertCase): Promise<Case>;
  updateCaseStatus(id: string, status: string): Promise<Case>;

  // Evidence operations
  getEvidence(caseId?: string): Promise<Evidence[]>;
  createEvidence(evidenceData: InsertEvidence): Promise<Evidence>;

  // Chain of Custody operations
  addCustodyEntry(entry: InsertChainOfCustody): Promise<void>;
  getCustodyChain(evidenceId: string): Promise<any[]>;

  // Analysis Results operations
  createAnalysisResult(result: InsertAnalysisResult): Promise<void>;

  // Audit Log operations
  logActivity(userId: string, action: string, resourceType?: string, resourceId?: string, details?: any, ipAddress?: string, userAgent?: string): Promise<void>;
  getAuditLogs(limit?: number): Promise<AuditLog[]>;

  // Stats operations
  getStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // ==================== USER OPERATIONS ====================
  // (IMPORTANT) Required for Replit Auth

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // ==================== CASE OPERATIONS ====================

  async getCases(): Promise<Case[]> {
    return await db.select().from(cases).orderBy(desc(cases.createdAt));
  }

  async getCase(id: string): Promise<Case | undefined> {
    const [caseItem] = await db.select().from(cases).where(eq(cases.id, id));
    return caseItem;
  }

  async createCase(caseData: InsertCase): Promise<Case> {
    const [newCase] = await db
      .insert(cases)
      .values(caseData)
      .returning();
    return newCase;
  }

  async updateCaseStatus(id: string, status: string): Promise<Case> {
    const [updatedCase] = await db
      .update(cases)
      .set({ status, updatedAt: new Date() })
      .where(eq(cases.id, id))
      .returning();
    return updatedCase;
  }

  // ==================== EVIDENCE OPERATIONS ====================

  async getEvidence(caseId?: string): Promise<Evidence[]> {
    if (caseId) {
      return await db
        .select()
        .from(evidence)
        .where(eq(evidence.caseId, caseId))
        .orderBy(desc(evidence.createdAt));
    }
    return await db.select().from(evidence).orderBy(desc(evidence.createdAt));
  }

  async createEvidence(evidenceData: InsertEvidence): Promise<Evidence> {
    const [newEvidence] = await db
      .insert(evidence)
      .values(evidenceData)
      .returning();
    return newEvidence;
  }

  // ==================== CHAIN OF CUSTODY OPERATIONS ====================

  async addCustodyEntry(entry: InsertChainOfCustody): Promise<void> {
    await db.insert(chainOfCustody).values(entry);
  }

  async getCustodyChain(evidenceId: string): Promise<any[]> {
    return await db
      .select()
      .from(chainOfCustody)
      .where(eq(chainOfCustody.evidenceId, evidenceId))
      .orderBy(desc(chainOfCustody.timestamp));
  }

  // ==================== ANALYSIS RESULTS OPERATIONS ====================

  async createAnalysisResult(result: InsertAnalysisResult): Promise<void> {
    await db.insert(analysisResults).values(result);
  }

  // ==================== AUDIT LOG OPERATIONS ====================

  async logActivity(
    userId: string,
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await db.insert(auditLogs).values({
      userId,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress,
      userAgent,
    });
  }

  async getAuditLogs(limit: number = 100): Promise<AuditLog[]> {
    return await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.timestamp))
      .limit(limit);
  }

  // ==================== STATS OPERATIONS ====================

  async getStats(): Promise<any> {
    const allCases = await db.select().from(cases);
    const allEvidence = await db.select().from(evidence);
    const allAnalyses = await db.select().from(analysisResults);

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const activeCases = allCases.filter(
      c => c.status === 'open' || c.status === 'in_progress'
    ).length;

    const completedCases = allCases.filter(
      c => c.status === 'closed' && c.updatedAt && c.updatedAt >= firstDayOfMonth
    ).length;

    return {
      activeCases,
      evidenceCount: allEvidence.length,
      activeAnalyses: allAnalyses.length,
      completedCases,
    };
  }
}

export const storage = new DatabaseStorage();
