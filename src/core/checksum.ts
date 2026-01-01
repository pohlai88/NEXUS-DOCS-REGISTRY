// @aibos/docs-registry — Checksum Utilities
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTHORITY: SRS-DOCSREG-001 §3.1
// PURPOSE: Deterministic checksum computation with normalization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import crypto from "node:crypto";

/**
 * Normalize content for deterministic checksum.
 *
 * Algorithm:
 * 1. Replace CRLF with LF
 * 2. Trim trailing whitespace per line
 * 3. Trim trailing newlines from end
 *
 * This ensures same checksum on Windows and Unix.
 */
export function normalizeContent(content: string): string {
  return content
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/, ""))
    .join("\n")
    .trimEnd();
}

/**
 * Compute SHA-256 (or SHA-512) checksum of normalized content.
 *
 * @param content - Raw file content
 * @param algorithm - Hash algorithm (default: "sha256")
 * @returns Lowercase hex string (64 chars for SHA-256, 128 for SHA-512)
 */
export function computeChecksum(
  content: string,
  algorithm: "sha256" | "sha512" = "sha256"
): string {
  const normalized = normalizeContent(content);
  return crypto.createHash(algorithm).update(normalized, "utf8").digest("hex");
}
