// @aibos/docs-registry — Document JSON Schema
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTHORITY: RFC-DOCSREG-001 §4, SRS-DOCSREG-001 §2
// PURPOSE: Zod schema for doc.json validation (SSOT for document metadata)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Document types in authority hierarchy order.
 * LAW → PRD → SRS → ADR → TSD → SOP
 * RFC is a special pre-decision type.
 */
export const DocumentType = z.enum([
  "LAW",
  "PRD",
  "SRS",
  "ADR",
  "TSD",
  "SOP",
  "RFC",
]);

/**
 * Document lifecycle status.
 */
export const DocumentStatus = z.enum([
  "DRAFT",
  "REVIEW",
  "APPROVED",
  "IMPLEMENTED",
  "SUPERSEDED",
  "DEPRECATED",
]);

/**
 * Authority level — where this document derives its power.
 */
export const AuthorityLevel = z.enum([
  "ABSOLUTE", // Constitutional (LAW only)
  "DERIVED", // Derives from parent document
]);

/**
 * Evidence scope — where the implementation lives.
 */
export const EvidenceScope = z.enum([
  "kernel",
  "platform",
  "portal",
  "repo",
  "law",
  "package",
]);

/**
 * When enforcement happens.
 */
export const EnforcementWhen = z.enum([
  "CI",
  "Runtime",
  "Human Governance",
  "Build",
]);

/**
 * How the requirement is verified.
 */
export const VerificationType = z.enum([
  "test",
  "lint",
  "migration",
  "runtime_guard",
  "policy_only",
  "ddl",
  "architectural",
  "policy",
  "schema",
]);

// ─────────────────────────────────────────────────────────────────────────────
// Pattern Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Clause ID pattern: LAW-XXX.PNN.NN
 * Example: LAW-001.A01.03
 */
export const ClauseId = z.string().regex(/^LAW-\d{3}\.[A-Z]\d{2}\.\d{2}$/);

/**
 * Verification reference — machine-parseable path.
 * Examples:
 *   - packages/kernel/src/values.ts:L10-L50
 *   - apps/portal/supabase/migrations/001_init.sql
 *   - package.json:scripts.audit:law
 */
export const VerificationRef = z
  .string()
  .min(1)
  .refine(
    (v) => {
      // No spaces, no markdown formatting
      return !/\s/.test(v) && !/[()`*_]/.test(v);
    },
    {
      message:
        "verification_ref must be machine-parseable (no spaces/markdown). Use path[:Lx-Ly] format.",
    }
  );

// ─────────────────────────────────────────────────────────────────────────────
// Nested Schemas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Approval record — tracks document lifecycle events.
 */
export const ApprovalRecord = z.object({
  action: z.enum([
    "CREATED",
    "PATCHED",
    "APPROVED",
    "DEPRECATED",
    "SUPERSEDED",
  ]),
  by: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().min(1),
});

export type ApprovalRecordType = z.infer<typeof ApprovalRecord>;

/**
 * Implemented clause — links LAW-001 clauses to evidence.
 */
export const ImplementedClause = z.object({
  clause_id: ClauseId,
  title: z.string().min(1),
  status: z.enum(["IMPLEMENTED", "PARTIAL", "OPEN"]),
  verification_type: VerificationType,
  verification_ref: VerificationRef,
  enforced_in: EnforcementWhen,
  evidence_scope: EvidenceScope,
});

export type ImplementedClauseType = z.infer<typeof ImplementedClause>;

// ─────────────────────────────────────────────────────────────────────────────
// Main Schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * DocJsonSchema — The SSOT for document metadata.
 *
 * This schema validates doc.json files. Each document folder contains:
 * - doc.json (validated by this schema)
 * - doc.md (human content + managed header block)
 *
 * @example
 * ```typescript
 * import { DocJsonSchema } from "@aibos/docs-registry";
 *
 * const result = DocJsonSchema.safeParse(rawJson);
 * if (!result.success) {
 *   console.error(result.error.issues);
 * }
 * ```
 */
export const DocJsonSchema = z.object({
  // ─────────────────────────────────────────────────────────────────────────
  // Identity (Immutable)
  // ─────────────────────────────────────────────────────────────────────────
  document_id: z
    .string()
    .min(3)
    .regex(/^(LAW|PRD|SRS|ADR|TSD|SOP|RFC)-[A-Z0-9]+-\d{3}$/),
  document_type: DocumentType,
  classification: z.string().min(1), // e.g., "CONSTITUTION", "STANDARD", "PROPOSAL"

  // ─────────────────────────────────────────────────────────────────────────
  // Content
  // ─────────────────────────────────────────────────────────────────────────
  title: z.string().min(1),
  abstract: z.string().optional(),

  // ─────────────────────────────────────────────────────────────────────────
  // Governance
  // ─────────────────────────────────────────────────────────────────────────
  status: DocumentStatus,
  authority: AuthorityLevel,
  scope: z.string().min(1), // e.g., "KERNEL", "PLATFORM", "PORTAL"

  // ─────────────────────────────────────────────────────────────────────────
  // Lineage
  // ─────────────────────────────────────────────────────────────────────────
  derived_from: z.array(z.string().min(1)).default([]),
  supersedes: z.array(z.string().min(1)).default([]),

  // ─────────────────────────────────────────────────────────────────────────
  // Versioning
  // ─────────────────────────────────────────────────────────────────────────
  version: z.string().regex(/^\d+\.\d+\.\d+$/),

  // ─────────────────────────────────────────────────────────────────────────
  // Ownership
  // ─────────────────────────────────────────────────────────────────────────
  owners: z.array(z.string().min(1)).default([]),

  // ─────────────────────────────────────────────────────────────────────────
  // Integrity
  // ─────────────────────────────────────────────────────────────────────────
  checksum_sha256: z
    .string()
    .regex(/^[a-f0-9]{64}$/)
    .nullable()
    .default(null),

  // ─────────────────────────────────────────────────────────────────────────
  // LAW-001 Clause Implementation (Optional)
  // ─────────────────────────────────────────────────────────────────────────
  clause_id_prefix: z.string().optional(),
  clause_id_regex: z.string().optional(),
  implemented: z.array(ImplementedClause).default([]),

  // ─────────────────────────────────────────────────────────────────────────
  // Approval History
  // ─────────────────────────────────────────────────────────────────────────
  approvals: z.array(ApprovalRecord).default([]),

  // ─────────────────────────────────────────────────────────────────────────
  // Timestamps
  // ─────────────────────────────────────────────────────────────────────────
  created_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updated_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type DocJson = z.infer<typeof DocJsonSchema>;
