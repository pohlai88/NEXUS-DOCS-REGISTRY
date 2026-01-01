// @aibos/docs-registry — Document Discovery
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTHORITY: SRS-DOCSREG-001 §3.2
// PURPOSE: Scan filesystem for doc.json files and validate
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { glob } from "glob";
import fs from "node:fs";
import path from "node:path";
import { DocJsonSchema } from "../schema/doc.schema.js";
import type { DiscoveredDoc } from "../types/index.js";

/**
 * Discover all documents in a directory.
 *
 * Scans for all doc.json files, validates against schema, and returns
 * sorted array of discovered documents.
 *
 * @param docsDir - Root directory to scan
 * @returns Array of discovered documents, sorted by document_id
 * @throws If any doc.json fails schema validation (fail-fast per ADR-007)
 */
export async function discoverDocs(docsDir: string): Promise<DiscoveredDoc[]> {
  // Normalize path for cross-platform glob
  const pattern = path.join(docsDir, "**", "doc.json").replace(/\\/g, "/");
  const jsonPaths = await glob(pattern);

  const docs: DiscoveredDoc[] = [];

  for (const jsonPath of jsonPaths) {
    const absolutePath = path.resolve(jsonPath);
    const raw = JSON.parse(fs.readFileSync(absolutePath, "utf8"));

    // Fail-fast on schema error (ADR-007)
    const docJson = DocJsonSchema.parse(raw);

    const docMdPath = path.join(path.dirname(absolutePath), "doc.md");

    docs.push({
      docId: docJson.document_id,
      docJsonPath: absolutePath,
      docMdPath,
      docJson,
    });
  }

  // Sort deterministically (ADR-009)
  docs.sort((a, b) => a.docId.localeCompare(b.docId));

  return docs;
}
