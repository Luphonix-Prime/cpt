import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Extend express-session types
declare module 'express-session' {
  interface SessionData {
    userId: string;
    user: any;
  }
}

// ==================== AUTH TABLES (Required for Replit Auth) ====================

// Session storage table - Required for Replit Auth
export const sessions = sqliteTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    sess: text("sess", { mode: 'json' }).notNull(),
    expire: integer("expire", { mode: 'timestamp' }).notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - Required for Replit Auth
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  role: text("role").notNull().default('analyst'), // admin, analyst, supervisor, auditor
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// ==================== FORENSICS TABLES ====================

// Cases table
export const cases = sqliteTable("cases", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  caseNumber: text("case_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default('open'), // open, in_progress, closed, archived
  priority: text("priority").notNull().default('medium'), // low, medium, high, critical
  assignedToId: text("assigned_to_id").references(() => users.id),
  createdById: text("created_by_id").notNull().references(() => users.id),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const casesRelations = relations(cases, ({ one, many }) => ({
  assignedTo: one(users, {
    fields: [cases.assignedToId],
    references: [users.id],
    relationName: "assignedCases",
  }),
  createdBy: one(users, {
    fields: [cases.createdById],
    references: [users.id],
    relationName: "createdCases",
  }),
  evidence: many(evidence),
  analysisResults: many(analysisResults),
}));

// Evidence table
export const evidence = sqliteTable("evidence", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  caseId: text("case_id").notNull().references(() => cases.id, { onDelete: 'cascade' }),
  evidenceNumber: text("evidence_number").notNull(),
  type: text("type").notNull(), // image, video, document, mobile_data, network_capture, etc.
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"), // in bytes
  filePath: text("file_path"), // storage path
  sha256Hash: text("sha256_hash").notNull(),
  description: text("description"),
  collectedBy: text("collected_by").notNull().references(() => users.id),
  collectedAt: integer("collected_at", { mode: 'timestamp' }).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const evidenceRelations = relations(evidence, ({ one, many }) => ({
  case: one(cases, {
    fields: [evidence.caseId],
    references: [cases.id],
  }),
  collector: one(users, {
    fields: [evidence.collectedBy],
    references: [users.id],
  }),
  custodyChain: many(chainOfCustody),
  analysisResults: many(analysisResults),
}));

// Chain of Custody table
export const chainOfCustody = sqliteTable("chain_of_custody", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  evidenceId: text("evidence_id").notNull().references(() => evidence.id, { onDelete: 'cascade' }),
  action: text("action").notNull(), // collected, transferred, analyzed, stored, etc.
  userId: text("user_id").notNull().references(() => users.id),
  timestamp: integer("timestamp", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  location: text("location"),
  notes: text("notes"),
  ipAddress: text("ip_address"),
});

export const chainOfCustodyRelations = relations(chainOfCustody, ({ one }) => ({
  evidence: one(evidence, {
    fields: [chainOfCustody.evidenceId],
    references: [evidence.id],
  }),
  user: one(users, {
    fields: [chainOfCustody.userId],
    references: [users.id],
  }),
}));

// Analysis Results table (for all forensic modules)
export const analysisResults = sqliteTable("analysis_results", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  caseId: text("case_id").notNull().references(() => cases.id, { onDelete: 'cascade' }),
  evidenceId: text("evidence_id").references(() => evidence.id, { onDelete: 'cascade' }),
  moduleType: text("module_type").notNull(), // ai_deepfake, social_media, image_forensics, etc.
  analysisType: text("analysis_type").notNull(),
  results: text("results", { mode: 'json' }).notNull(), // JSON structure varies by module
  confidence: integer("confidence"), // 0-100
  flagged: integer("flagged", { mode: 'boolean' }).default(false),
  analyzedBy: text("analyzed_by").notNull().references(() => users.id),
  analyzedAt: integer("analyzed_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const analysisResultsRelations = relations(analysisResults, ({ one }) => ({
  case: one(cases, {
    fields: [analysisResults.caseId],
    references: [cases.id],
  }),
  evidence: one(evidence, {
    fields: [analysisResults.evidenceId],
    references: [evidence.id],
  }),
  analyzer: one(users, {
    fields: [analysisResults.analyzedBy],
    references: [users.id],
  }),
}));

// Audit Log table
export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  action: text("action").notNull(),
  resourceType: text("resource_type"), // case, evidence, analysis, etc.
  resourceId: text("resource_id"),
  details: text("details", { mode: 'json' }),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: integer("timestamp", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  index("idx_audit_logs_user").on(table.userId),
  index("idx_audit_logs_timestamp").on(table.timestamp),
]);

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

// ==================== INSERT SCHEMAS ====================

export const insertCaseSchema = createInsertSchema(cases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEvidenceSchema = createInsertSchema(evidence).omit({
  id: true,
  createdAt: true,
});

export const insertAnalysisResultSchema = createInsertSchema(analysisResults).omit({
  id: true,
  createdAt: true,
});

export const insertChainOfCustodySchema = createInsertSchema(chainOfCustody).omit({
  id: true,
});

// ==================== TYPES ====================

export type InsertCase = z.infer<typeof insertCaseSchema>;
export type Case = typeof cases.$inferSelect;

export type InsertEvidence = z.infer<typeof insertEvidenceSchema>;
export type Evidence = typeof evidence.$inferSelect;

export type InsertAnalysisResult = z.infer<typeof insertAnalysisResultSchema>;
export type AnalysisResult = typeof analysisResults.$inferSelect;

export type InsertChainOfCustody = z.infer<typeof insertChainOfCustodySchema>;
export type ChainOfCustody = typeof chainOfCustody.$inferSelect;

export type AuditLog = typeof auditLogs.$inferSelect;