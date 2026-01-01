#!/usr/bin/env node
// @aibos/docs-registry — Audit Orphans Script
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import path from "node:path";
import { fileURLToPath } from "node:url";
import { auditOrphans } from "../core/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const packageRoot = path.resolve(__dirname, "..", "..");
  const docsDir = path.join(packageRoot, "docs");

  console.log(`🔍 Auditing for orphan/phantom docs in: ${docsDir}`);

  const result = await auditOrphans({ docsDir });

  if (!result.passed) {
    console.error(`❌ Orphan audit failed:`);
    for (const v of result.violations) {
      console.error(`  [${v.type}] ${v.docId}: ${v.message}`);
    }
    process.exit(1);
  }

  console.log(`✅ Orphan audit passed`);
}

main().catch((error) => {
  console.error("❌ Audit failed:", error);
  process.exit(1);
});
