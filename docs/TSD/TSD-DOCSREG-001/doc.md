<!-- BEGIN: AIBOS_MANAGED -->
| Field | Value | |---|---| | **Document ID** |
TSD-DOCSREG-001
| | **Document Type** |
TSD
| | **Classification** |
STANDARD
| | **Title** |
Document Registry SDK Technical Specification
| | **Status** |
DRAFT
| | **Authority** |
DERIVED
| | **Derived From** |
`LAW-001`,
    `ADR-DOCSREG-001`
| | **Version** |
0.1.0
| | **Owners** |
`Poh Lai`
| | **Checksum (SHA-256)** |
`e792b00c81611f1f76ec076fa8114de8b236996b4caabc5d640f113ce570da1c`
| | **Updated** |
2026-01-01
|
<!-- END: AIBOS_MANAGED -->



# TSD-DOCSREG-001 — Document Registry SDK Technical Specification

## Abstract

This TSD provides the technical specification for implementing `@aibos/docs-registry`. It defines file structure, module layout, function implementations, and code patterns.

---

## §1 — Package Structure

```
packages/docs-registry/
├── package.json
├── tsconfig.json
├── README.md
├── LICENSE
├── docs/                          # Package governance docs
│   ├── INDEX.md                   # Generated
│   ├── RFC/
│   │   └── RFC-DOCSREG-001/
│   ├── PRD/
│   │   └── PRD-DOCSREG-001/
│   ├── SRS/
│   │   └── SRS-DOCSREG-001/
│   ├── ADR/
│   │   └── ADR-DOCSREG-001/
│   ├── TSD/
│   │   └── TSD-DOCSREG-001/
│   └── SOP/
│       └── SOP-DOCSREG-001/
├── src/
│   ├── index.ts                   # Main exports
│   ├── schema/
│   │   ├── index.ts               # Schema exports
│   │   └── doc.schema.ts          # Zod schemas
│   ├── core/
│   │   ├── generate.ts            # generateDocs(), generateIndex()
│   │   ├── audit.ts               # auditAll(), auditIndex(), etc.
│   │   ├── checksum.ts            # Checksum computation
│   │   └── discovery.ts           # Document scanning
│   ├── templates/
│   │   ├── index.ts               # Template helpers
│   │   ├── header.md.hbs          # Managed block template
│   │   └── body/
│   │       ├── RFC.body.md.hbs
│   │       ├── PRD.body.md.hbs
│   │       ├── SRS.body.md.hbs
│   │       ├── ADR.body.md.hbs
│   │       ├── TSD.body.md.hbs
│   │       ├── SOP.body.md.hbs
│   │       └── LAW.body.md.hbs
│   ├── packs/
│   │   ├── index.ts               # createStandardSet()
│   │   └── kernel-governance-v1.ts
│   └── types/
│       └── index.ts               # Shared types
└── dist/                          # Compiled output
```

---

## §2 — Module Specifications

### §2.1 — src/index.ts

```typescript
// Main entry point — re-exports all public API

// Schemas
export * from "./schema/index.js";

// Core functions
export { generateDocs, generateIndex } from "./core/generate.js";
export {
  auditAll,
  auditIndex,
  auditChecksum,
  auditOrphans,
} from "./core/audit.js";

// Packs
export { createStandardSet } from "./packs/index.js";

// Types
export type {
  DocsRegistryConfig,
  GenerateResult,
  AuditResult,
  Violation,
} from "./types/index.js";
```

### §2.2 — src/types/index.ts

```typescript
export interface DocsRegistryConfig {
  /** Root directory containing docs (default: "docs") */
  docsDir: string;
  /** Custom templates directory (optional) */
  templatesDir?: string;
  /** Checksum algorithm (default: "sha256") */
  checksumAlgorithm?: "sha256" | "sha512";
}

export interface GenerateResult {
  processed: number;
  updated: string[];
  errors: Array<{ docId: string; error: string }>;
}

export interface AuditResult {
  passed: boolean;
  violations: Violation[];
}

export interface Violation {
  type: "INVALID_SCHEMA" | "CHECKSUM_MISMATCH" | "PHANTOM_DOC" | "MISSING_DOC";
  docId: string;
  message: string;
  path: string;
}

export interface DiscoveredDoc {
  docId: string;
  docJsonPath: string;
  docMdPath: string;
  docJson: import("../schema/doc.schema.js").DocJson;
}
```

### §2.3 — src/core/checksum.ts

```typescript
import crypto from "node:crypto";

/**
 * Normalize content for deterministic checksum.
 * - Replace CRLF with LF
 * - Trim trailing whitespace per line
 * - Trim trailing newlines
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
 * Compute SHA-256 checksum of normalized content.
 */
export function computeChecksum(
  content: string,
  algorithm: "sha256" | "sha512" = "sha256"
): string {
  const normalized = normalizeContent(content);
  return crypto.createHash(algorithm).update(normalized, "utf8").digest("hex");
}
```

### §2.4 — src/core/discovery.ts

```typescript
import fs from "node:fs";
import path from "node:path";
import { glob } from "glob";
import { DocJsonSchema, type DocJson } from "../schema/doc.schema.js";
import type { DiscoveredDoc } from "../types/index.js";

/**
 * Discover all documents in a directory.
 */
export async function discoverDocs(docsDir: string): Promise<DiscoveredDoc[]> {
  const pattern = path.join(docsDir, "**", "doc.json").replace(/\\/g, "/");
  const jsonPaths = await glob(pattern);

  const docs: DiscoveredDoc[] = [];

  for (const jsonPath of jsonPaths) {
    const raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    const docJson = DocJsonSchema.parse(raw); // Throws on invalid
    const docMdPath = path.join(path.dirname(jsonPath), "doc.md");

    docs.push({
      docId: docJson.document_id,
      docJsonPath: jsonPath,
      docMdPath,
      docJson,
    });
  }

  // Sort deterministically
  docs.sort((a, b) => a.docId.localeCompare(b.docId));

  return docs;
}
```

### §2.5 — src/core/generate.ts

```typescript
import fs from "node:fs";
import path from "node:path";
import Handlebars from "handlebars";
import { discoverDocs } from "./discovery.js";
import { computeChecksum } from "./checksum.js";
import type {
  DocsRegistryConfig,
  GenerateResult,
  DiscoveredDoc,
} from "../types/index.js";

const BEGIN_MARKER = "<!-- BEGIN: AIBOS_MANAGED -->";
const END_MARKER = "<!-- END: AIBOS_MANAGED -->";

/**
 * Load Handlebars template from file or default.
 */
function loadTemplate(
  templatesDir: string | undefined,
  name: string
): HandlebarsTemplateDelegate {
  const defaultPath = path.join(__dirname, "..", "templates", name);
  const customPath = templatesDir ? path.join(templatesDir, name) : null;

  const templatePath =
    customPath && fs.existsSync(customPath) ? customPath : defaultPath;
  const source = fs.readFileSync(templatePath, "utf8");
  return Handlebars.compile(source, { noEscape: true });
}

/**
 * Upsert managed block in markdown content.
 */
function upsertManagedBlock(content: string, managed: string): string {
  const start = content.indexOf(BEGIN_MARKER);
  const end = content.indexOf(END_MARKER);

  if (start !== -1 && end !== -1 && end > start) {
    return (
      content.slice(0, start) + managed + content.slice(end + END_MARKER.length)
    );
  }

  // No block exists — prepend
  return managed + "\n\n" + content.trimStart();
}

/**
 * Generate docs — update managed blocks and checksums.
 */
export async function generateDocs(
  config: DocsRegistryConfig
): Promise<GenerateResult> {
  const docs = await discoverDocs(config.docsDir);
  const headerTemplate = loadTemplate(config.templatesDir, "header.md.hbs");

  const result: GenerateResult = {
    processed: docs.length,
    updated: [],
    errors: [],
  };

  for (const doc of docs) {
    try {
      // Render managed block
      const managed = headerTemplate(doc.docJson);

      // Read existing doc.md or create empty
      const existingMd = fs.existsSync(doc.docMdPath)
        ? fs.readFileSync(doc.docMdPath, "utf8")
        : "";

      // Upsert managed block
      const newMd = upsertManagedBlock(existingMd, managed);

      // Write doc.md
      fs.writeFileSync(doc.docMdPath, newMd, "utf8");

      // Compute checksum
      const checksum = computeChecksum(newMd, config.checksumAlgorithm);

      // Update doc.json with checksum
      const updatedJson = { ...doc.docJson, checksum_sha256: checksum };
      fs.writeFileSync(
        doc.docJsonPath,
        JSON.stringify(updatedJson, null, 2) + "\n",
        "utf8"
      );

      result.updated.push(doc.docId);
    } catch (error) {
      result.errors.push({
        docId: doc.docId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return result;
}

/**
 * Generate INDEX.md from all discovered docs.
 */
export async function generateIndex(config: DocsRegistryConfig): Promise<void> {
  const docs = await discoverDocs(config.docsDir);

  const rows = docs.map((doc) => {
    const relPath = path
      .relative(config.docsDir, doc.docMdPath)
      .replace(/\\/g, "/");
    const checksum = doc.docJson.checksum_sha256
      ? `\`${doc.docJson.checksum_sha256.slice(0, 16)}...\``
      : "`—`";

    return `| ${doc.docJson.document_id} | ${doc.docJson.title} | v${doc.docJson.version} | ${doc.docJson.status} | ${doc.docJson.authority} | ${checksum} | ${relPath} |`;
  });

  const index = [
    "# Document Index (Generated)",
    "",
    "> DO NOT hand-edit. Generated by `@aibos/docs-registry`.",
    "",
    "| Doc ID | Title | Version | Status | Authority | Checksum | Path |",
    "|--------|-------|--------:|--------|-----------|----------|------|",
    ...rows,
    "",
  ].join("\n");

  const indexPath = path.join(config.docsDir, "INDEX.md");
  fs.writeFileSync(indexPath, index, "utf8");
}
```

### §2.6 — src/core/audit.ts

```typescript
import fs from "node:fs";
import path from "node:path";
import { discoverDocs } from "./discovery.js";
import { computeChecksum } from "./checksum.js";
import { generateIndex } from "./generate.js";
import type {
  DocsRegistryConfig,
  AuditResult,
  Violation,
} from "../types/index.js";

/**
 * Audit all: schema, checksum, orphans.
 */
export async function auditAll(
  config: DocsRegistryConfig
): Promise<AuditResult> {
  const results = await Promise.all([
    auditChecksum(config),
    auditOrphans(config),
  ]);

  const violations = results.flatMap((r) => r.violations);
  return {
    passed: violations.length === 0,
    violations,
  };
}

/**
 * Audit checksums — computed vs stored.
 */
export async function auditChecksum(
  config: DocsRegistryConfig
): Promise<AuditResult> {
  const docs = await discoverDocs(config.docsDir);
  const violations: Violation[] = [];

  for (const doc of docs) {
    if (!fs.existsSync(doc.docMdPath)) continue;

    const content = fs.readFileSync(doc.docMdPath, "utf8");
    const computed = computeChecksum(content, config.checksumAlgorithm);
    const stored = doc.docJson.checksum_sha256;

    if (stored && computed !== stored) {
      violations.push({
        type: "CHECKSUM_MISMATCH",
        docId: doc.docId,
        message: `Checksum mismatch: stored=${stored.slice(
          0,
          16
        )}... computed=${computed.slice(0, 16)}...`,
        path: doc.docMdPath,
      });
    }
  }

  return { passed: violations.length === 0, violations };
}

/**
 * Audit INDEX.md ↔ filesystem consistency.
 */
export async function auditIndex(
  config: DocsRegistryConfig
): Promise<AuditResult> {
  const indexPath = path.join(config.docsDir, "INDEX.md");

  if (!fs.existsSync(indexPath)) {
    return {
      passed: false,
      violations: [
        {
          type: "MISSING_DOC",
          docId: "INDEX",
          message: "INDEX.md does not exist",
          path: indexPath,
        },
      ],
    };
  }

  // Generate expected INDEX
  const tempDir = fs.mkdtempSync("audit-index-");
  const tempConfig = { ...config, docsDir: config.docsDir };

  // Read current INDEX
  const currentIndex = fs.readFileSync(indexPath, "utf8");

  // Generate new INDEX to temp
  await generateIndex(tempConfig);
  const expectedIndex = fs.readFileSync(indexPath, "utf8");

  // Restore original
  fs.writeFileSync(indexPath, currentIndex, "utf8");

  if (currentIndex !== expectedIndex) {
    return {
      passed: false,
      violations: [
        {
          type: "PHANTOM_DOC",
          docId: "INDEX",
          message:
            "INDEX.md differs from expected. Run generateIndex() to fix.",
          path: indexPath,
        },
      ],
    };
  }

  return { passed: true, violations: [] };
}

/**
 * Audit for orphan/phantom documents.
 */
export async function auditOrphans(
  config: DocsRegistryConfig
): Promise<AuditResult> {
  const indexPath = path.join(config.docsDir, "INDEX.md");
  const violations: Violation[] = [];

  if (!fs.existsSync(indexPath)) {
    return { passed: true, violations: [] }; // No INDEX to check
  }

  const indexContent = fs.readFileSync(indexPath, "utf8");
  const docs = await discoverDocs(config.docsDir);

  // Extract doc IDs from INDEX
  const indexDocIds = new Set<string>();
  const rowPattern = /^\| ([A-Z]+-[A-Z0-9]+-\d{3}) \|/gm;
  let match;
  while ((match = rowPattern.exec(indexContent)) !== null) {
    indexDocIds.add(match[1]);
  }

  // Filesystem doc IDs
  const fsDocIds = new Set(docs.map((d) => d.docId));

  // Phantom: in INDEX but not filesystem
  for (const indexId of indexDocIds) {
    if (!fsDocIds.has(indexId)) {
      violations.push({
        type: "PHANTOM_DOC",
        docId: indexId,
        message: `Document ${indexId} in INDEX.md but not on filesystem`,
        path: indexPath,
      });
    }
  }

  // Missing: in filesystem but not INDEX
  for (const fsId of fsDocIds) {
    if (!indexDocIds.has(fsId)) {
      violations.push({
        type: "MISSING_DOC",
        docId: fsId,
        message: `Document ${fsId} on filesystem but not in INDEX.md`,
        path: path.join(config.docsDir, "**", fsId),
      });
    }
  }

  return { passed: violations.length === 0, violations };
}
```

---

## §3 — Template Specifications

### §3.1 — header.md.hbs

```handlebars
<!-- BEGIN: AIBOS_MANAGED -->
| Field | Value | |---|---| | **Document ID** |
{{document_id}}
| | **Document Type** |
{{document_type}}
| | **Classification** |
{{classification}}
| | **Title** |
{{title}}
| | **Status** |
{{status}}
| | **Authority** |
{{authority}}
| | **Derived From** |
{{#if derived_from.length}}{{#each derived_from}}`{{this}}`{{#unless @last}},
    {{/unless}}{{/each}}{{else}}—{{/if}}
| | **Version** |
{{version}}
| | **Owners** |
{{#if owners.length}}{{#each owners}}`{{this}}`{{#unless @last}},
    {{/unless}}{{/each}}{{else}}—{{/if}}
| | **Checksum (SHA-256)** |
{{#if
  checksum_sha256
}}`{{checksum_sha256}}`{{else}}`sys_document_registry.checksum`{{/if}}
| | **Updated** |
{{updated_at}}
|
<!-- END: AIBOS_MANAGED -->
```

---

## §4 — Build Configuration

### §4.1 — tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "docs"]
}
```

### §4.2 — package.json exports

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./schema": {
      "import": "./dist/schema/index.js",
      "types": "./dist/schema/index.d.ts"
    }
  }
}
```

---

## §5 — Usage Examples

### §5.1 — Validate doc.json

```typescript
import { DocJsonSchema } from "@aibos/docs-registry/schema";
import fs from "node:fs";

const raw = JSON.parse(fs.readFileSync("docs/PRD/PRD-001/doc.json", "utf8"));
const result = DocJsonSchema.safeParse(raw);

if (!result.success) {
  console.error(result.error.issues);
  process.exit(1);
}
```

### §5.2 — Generate all docs

```typescript
import { generateDocs, generateIndex } from "@aibos/docs-registry";

await generateDocs({ docsDir: "docs" });
await generateIndex({ docsDir: "docs" });
```

### §5.3 — Audit in CI

```typescript
import { auditAll } from "@aibos/docs-registry";

const result = await auditAll({ docsDir: "docs" });

if (!result.passed) {
  console.error("Audit failed:", result.violations);
  process.exit(1);
}
```

---

## References

- [ADR-DOCSREG-001](../ADR/ADR-DOCSREG-001/doc.md) — Architecture Decisions
- [SRS-DOCSREG-001](../SRS/SRS-DOCSREG-001/doc.md) — System Requirements

---

_Created: 2026-01-01_
