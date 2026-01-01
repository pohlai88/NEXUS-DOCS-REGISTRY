// @aibos/docs-registry — Document Governance SDK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTHORITY: RFC-DOCSREG-001, PRD-DOCSREG-001
// PURPOSE: NPM-pure governance SDK for document management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─────────────────────────────────────────────────────────────────────────────
// Schema Exports
// ─────────────────────────────────────────────────────────────────────────────
export * from "./schema/index.js";

// ─────────────────────────────────────────────────────────────────────────────
// Core Functions
// ─────────────────────────────────────────────────────────────────────────────
export {
  auditAll,
  auditChecksum,
  auditIndex,
  auditOrphans,
  computeChecksum,
  discoverDocs,
  generateDocs,
  generateIndex,
  normalizeContent,
} from "./core/index.js";

// ─────────────────────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────────────────────
export type {
  AuditResult,
  DiscoveredDoc,
  DocsRegistryConfig,
  GenerateResult,
  Violation,
} from "./types/index.js";
