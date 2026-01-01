# @aibos/docs-registry

> **Document Governance SDK**
> Machine-enforceable schemas, generation, audits, and constitutional document governance for AIBOS-style systems.

---

## What This Is

`@aibos/docs-registry` is an **NPM-pure governance SDK** for managing documents as **compiled artifacts**, not free-text files.

It enforces a **Human–Machine governance contract**:

* **Humans own meaning** — intent, rationale, philosophy
* **Machines own enforcement** — validation, consistency, memory
* **Drift is expected — but never silent**

This library is designed for teams who treat documentation as **infrastructure**, not decoration.

---

## Core Capabilities

* **Zod schemas** for `doc.json` (machine-validated SSOT)
* **Deterministic generation** of managed header blocks
* **Checksum enforcement** for content integrity
* **Filesystem → INDEX synchronization**
* **Full audit pipeline** (schema, checksum, index, orphans)
* **Standard document packs** for fast scaffolding

No runtime. No database. No services.
**Everything is file-based, deterministic, and auditable.**

---

## Installation

```bash
npm install @aibos/docs-registry
# or
pnpm add @aibos/docs-registry
```

Optional (for template generation):

```bash
npm install handlebars
```

---

## Conceptual Model (MITL)

This SDK implements a **Machine-In-The-Loop (MITL)** governance model:

```
Human Intent (Philosophy)
        ↓
Machine Contracts (Schemas)
        ↓
Deterministic Generation
        ↓
Audit & Drift Detection
```

Documents are not “written”.
They are **compiled**.

---

## Document Structure

Each document lives in its own folder:

```
docs/<TYPE>/<DOC-ID>/
  doc.json   ← Machine-validated metadata (SSOT)
  doc.md     ← Human content + managed block
```

### doc.json (SSOT)

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

This file is the **single source of truth**.
`doc.md` is derived.

---

## Managed Blocks (Generated)

The SDK injects a **managed header block** into `doc.md`:

```markdown
<!-- BEGIN: AIBOS_MANAGED -->

| Field           | Value           |
| --------------- | --------------- |
| **Document ID** | PRD-EXAMPLE-001 |
| **Status**      | DRAFT           |
| **Version**     | 0.1.0           |

<!-- END: AIBOS_MANAGED -->
```

Rules:

* Content **inside** the block is machine-owned
* Content **outside** the block is human-owned
* Manual edits inside the block are **overwritten**

---

## Quick Start

### Validate a Document

```ts
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

---

### Generate Managed Blocks & INDEX

```ts
import { generateDocs, generateIndex } from "@aibos/docs-registry";

await generateDocs({ docsDir: "docs" });
await generateIndex({ docsDir: "docs" });
```

---

### Run Full Audit

```ts
import { auditAll } from "@aibos/docs-registry";

const result = await auditAll({ docsDir: "docs" });

if (!result.passed) {
  console.error(result.violations);
  process.exit(1);
}

console.log("✅ All checks passed");
```

---

## Audit Guarantees

| Check      | Guarantee                            |
| ---------- | ------------------------------------ |
| Schema     | All `doc.json` pass Zod validation   |
| Checksum   | Content hash matches stored checksum |
| INDEX → FS | Every INDEX entry exists             |
| FS → INDEX | No undocumented files                |
| Orphans    | No stray documents                   |
| Drift      | All violations are explicit          |

**Nothing passes silently.**

---

## Document Types

| Type | Level | Purpose                     |
| ---- | ----- | --------------------------- |
| LAW  | 1     | Constitutional philosophy   |
| PRD  | 2     | Product intent & boundaries |
| SRS  | 3     | System requirements         |
| ADR  | 4     | Architecture decisions      |
| TSD  | 5     | Technical specification     |
| SOP  | 6     | Operating procedures        |
| RFC  | —     | Proposals (pre-decision)    |

---

## API Reference

### Schemas

```ts
import {
  DocJsonSchema,
  DocumentType,
  DocumentStatus,
  AuthorityLevel,
  type DocJson,
} from "@aibos/docs-registry/schema";
```

### Core Functions

```ts
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

```ts
interface DocsRegistryConfig {
  docsDir: string;
  templatesDir?: string;
  checksumAlgorithm?: "sha256";
}
```

---

## Governance Rules (Non-Negotiable)

### ✅ DO

* Treat `doc.json` as SSOT
* Generate, never hand-edit managed blocks
* Run audits before commit
* Use RFCs for structural change

### ❌ DON’T

* Edit generated sections
* Skip audits
* Rely on tribal memory
* Treat docs as free-text

---

## Design Philosophy

This SDK is intentionally strict.

It exists to eliminate:

* Silent drift
* Broken lineage
* Inconsistent documents
* “Out-of-date but nobody noticed” failures

If you want flexibility, use Markdown.
If you want **governance**, use this.

---

## License

MIT

---

### Final Recommendation

* ✅ **This README is npm-ready**
* ✅ **No workspace / pnpm leakage**
* ✅ **Single authoritative narrative**
* ✅ **Matches your Kernel-first doctrine**

If you want, next I can:

* Produce a **README diff** against your original
* Split **“Constitution”** into a separate advanced doc
* Create a **minimal README** + **full docs site version**

Just say the word.
