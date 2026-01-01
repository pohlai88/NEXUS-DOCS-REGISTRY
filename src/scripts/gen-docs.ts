#!/usr/bin/env node
// @aibos/docs-registry — Generate Docs Script
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateDocs, generateIndex } from "../core/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  // Resolve docs directory relative to package root
  const packageRoot = path.resolve(__dirname, "..", "..");
  const docsDir = path.join(packageRoot, "docs");

  console.log(`📄 Generating docs in: ${docsDir}`);

  // Generate managed blocks and checksums
  const result = await generateDocs({ docsDir });

  console.log(`✅ Processed: ${result.processed} documents`);
  console.log(`📝 Updated: ${result.updated.length} documents`);

  if (result.errors.length > 0) {
    console.error(`❌ Errors: ${result.errors.length}`);
    for (const err of result.errors) {
      console.error(`  - ${err.docId}: ${err.error}`);
    }
    process.exit(1);
  }

  // Generate INDEX.md
  await generateIndex({ docsDir });
  console.log(`📑 INDEX.md generated`);

  console.log(`\n✅ Generation complete`);
}

main().catch((error) => {
  console.error("❌ Generation failed:", error);
  process.exit(1);
});
