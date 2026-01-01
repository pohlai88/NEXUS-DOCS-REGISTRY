# @aibos/docs-registry

> **Document Governance SDK** — Schemas, generation, audits, and standard packs for AIBOS governance documents.

## Overview

`@aibos/docs-registry` is an NPM-pure library for machine-enforceable document governance. It provides:

- **Zod schemas** for document validation (doc.json)
- **Deterministic generation** of managed header blocks
- **Checksum enforcement** for content integrity
- **INDEX generation** from filesystem scan
- **Audit functions** for drift detection
- **Standard packs** for bulk document scaffolding

## Installation

```bash
npm install @aibos/docs-registry
# or
pnpm add @aibos/docs-registry
```

For template generation (optional):

```bash
npm install handlebars
```

## Quick Start

### Validate a Document

```typescript
import { DocJsonSchema } from "@aibos/docs-registry/schema";
import fs from "node:fs";

const raw = JSON.parse(fs.readFileSync("docs/PRD/PRD-001/doc.json", "utf8"));
const result = DocJsonSchema.safeParse(raw);

if (!result.success) {
  console.error(result.error.issues);
  process.exit(1);
}

console.log("Valid:", result.data.document_id);
```

### Generate Documents

```typescript
import { generateDocs, generateIndex } from "@aibos/docs-registry";

// Update managed blocks and checksums
await generateDocs({ docsDir: "docs" });

// Generate INDEX.md
await generateIndex({ docsDir: "docs" });
```

### Run Audits

```typescript
import { auditAll } from "@aibos/docs-registry";

const result = await auditAll({ docsDir: "docs" });

if (!result.passed) {
  console.error("Violations:", result.violations);
  process.exit(1);
}

console.log("✅ All checks passed");
```

## Document Structure

Each document is a folder with:

```
docs/<TYPE>/<DOC-ID>/
  doc.json   ← Machine-validated metadata (SSOT)
  doc.md     ← Human-authored content + managed block
```

### doc.json Schema

```json
{
  "document_id": "PRD-EXAMPLE-001",
  "document_type": "PRD",
  "classification": "STANDARD",
  "title": "Example Product Requirements",
  "status": "DRAFT",
  "authority": "DERIVED",
  "scope": "KERNEL",
  "derived_from": ["LAW-001"],
  "version": "0.1.0",
  "owners": ["Your Name"],
  "checksum_sha256": null,
  "created_at": "2026-01-01",
  "updated_at": "2026-01-01"
}
```

### Managed Block

The SDK generates a header block in doc.md:

```markdown
<!-- BEGIN: AIBOS_MANAGED -->

| Field           | Value           |
| --------------- | --------------- |
| **Document ID** | PRD-EXAMPLE-001 |
| **Status**      | DRAFT           |

...

<!-- END: AIBOS_MANAGED -->
```

Content outside these markers is human-owned and never modified.

## API Reference

### Schemas

```typescript
import {
  DocJsonSchema,
  DocumentType,
  DocumentStatus,
  AuthorityLevel,
  type DocJson,
} from "@aibos/docs-registry/schema";
```

### Core Functions

```typescript
import {
  generateDocs,
  generateIndex,
  auditAll,
  auditIndex,
  auditChecksum,
  auditOrphans,
  createStandardSet,
} from "@aibos/docs-registry";
```

### Configuration

```typescript
interface DocsRegistryConfig {
  docsDir: string; // Root docs directory
  templatesDir?: string; // Custom templates (optional)
  checksumAlgorithm?: "sha256"; // Default: sha256
}
```

## Audit Guarantees

| Check           | Description                            |
| --------------- | -------------------------------------- |
| Schema Validity | All doc.json files pass Zod validation |
| Checksum        | Computed hash matches stored hash      |
| INDEX → FS      | Every INDEX entry exists on filesystem |
| FS → INDEX      | Every filesystem doc is in INDEX       |

## Document Types

| Type | Level | Purpose                       |
| ---- | ----- | ----------------------------- |
| LAW  | 1     | Constitutional philosophy     |
| PRD  | 2     | Product intent and boundaries |
| SRS  | 3     | System requirements           |
| ADR  | 4     | Architecture decisions        |
| TSD  | 5     | Technical specification       |
| SOP  | 6     | Operating procedures          |
| RFC  | —     | Proposals (pre-decision)      |

## Package Governance

This package includes its own governance documentation:

- [RFC-DOCSREG-001](docs/RFC/RFC-DOCSREG-001/doc.md) — Proposal
- [PRD-DOCSREG-001](docs/PRD/PRD-DOCSREG-001/doc.md) — Product Requirements
- [SRS-DOCSREG-001](docs/SRS/SRS-DOCSREG-001/doc.md) — System Requirements
- [ADR-DOCSREG-001](docs/ADR/ADR-DOCSREG-001/doc.md) — Architecture Decisions
- [TSD-DOCSREG-001](docs/TSD/TSD-DOCSREG-001/doc.md) — Technical Specification
- [SOP-DOCSREG-001](docs/SOP/SOP-DOCSREG-001/doc.md) — Operating Procedures

## License

MIT
