#!/usr/bin/env node
// @aibos/docs-registry — Audit Checksum Script
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import path from "node:path";
import { fileURLToPath } from "node:url";
import { auditChecksum } from "../core/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const packageRoot = path.resolve(__dirname, "..", "..");
  const docsDir = path.join(packageRoot, "docs");

  console.log(`🔍 Auditing checksums in: ${docsDir}`);

  const result = await auditChecksum({ docsDir });

  if (!result.passed) {
    console.error(`❌ Checksum audit failed:`);
    for (const v of result.violations) {
      console.error(`  [${v.type}] ${v.docId}: ${v.message}`);
    }
    process.exit(1);
  }

  console.log(`✅ Checksum audit passed`);
}

main().catch((error) => {
  console.error("❌ Audit failed:", error);
  process.exit(1);
});
