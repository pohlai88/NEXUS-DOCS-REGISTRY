// @aibos/docs-registry — Type Exports
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { DocJson } from "../schema/doc.schema.js";

/**
 * Configuration for docs-registry functions.
 */
export interface DocsRegistryConfig {
  /** Root directory containing docs (default: "docs") */
  docsDir: string;
  /** Custom templates directory (optional) */
  templatesDir?: string;
  /** Checksum algorithm (default: "sha256") */
  checksumAlgorithm?: "sha256" | "sha512";
}

/**
 * Result of document generation.
 */
export interface GenerateResult {
  /** Number of documents processed */
  processed: number;
  /** Document IDs that were updated */
  updated: string[];
  /** Documents with errors */
  errors: Array<{ docId: string; error: string }>;
}

/**
 * Result of audit functions.
 */
export interface AuditResult {
  /** Overall pass/fail */
  passed: boolean;
  /** List of violations */
  violations: Violation[];
}

/**
 * A single audit violation.
 */
export interface Violation {
  /** Type of violation */
  type: "INVALID_SCHEMA" | "CHECKSUM_MISMATCH" | "PHANTOM_DOC" | "MISSING_DOC";
  /** Document ID */
  docId: string;
  /** Human-readable message */
  message: string;
  /** Path to document */
  path: string;
}

/**
 * A discovered document.
 */
export interface DiscoveredDoc {
  /** Document ID */
  docId: string;
  /** Path to doc.json */
  docJsonPath: string;
  /** Path to doc.md */
  docMdPath: string;
  /** Parsed and validated doc.json */
  docJson: DocJson;
}
