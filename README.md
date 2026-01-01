# @aibos/docs-registry

> **Document Governance SDK**
> Machine-enforceable schemas, generation, audits, and constitutional document governance for AIBOS-style systems.

**TL;DR:** This package is for **governance and compliance**, not just documentation. Use it when you need machine-validated document structure, audits, checksums, and constitutional governance. If you just need to write docs, use regular Markdown tools instead.

---

## What This Is

`@aibos/docs-registry` is an **NPM-pure governance SDK** for managing documents as **compiled artifacts**, not free-text files.

It enforces a **Human–Machine governance contract**:

* **Humans own meaning** — intent, rationale, philosophy
* **Machines own enforcement** — validation, consistency, memory
* **Drift is expected — but never silent**

This library is designed for teams who treat documentation as **infrastructure**, not decoration.

---

## When Is This Package Helpful?

### ✅ **Use This Package When:**

1. **You need governance and compliance**
   - Documents must be machine-validated
   - You need to prove compliance (audits, regulations)
   - Document lineage and authority chains matter
   - Example: Enterprise systems, regulated industries, constitutional governance

2. **You have structured document types**
   - PRDs, ADRs, RFCs, SRS, TSD, SOP documents
   - Documents follow a hierarchy (derive from each other)
   - Documents need metadata (status, owners, versions)
   - Example: Architecture documentation, product requirements, technical specs

3. **You need drift detection**
   - INDEX.md must stay in sync with filesystem
   - Content integrity must be verified (checksums)
   - Orphan documents must be detected
   - Example: Large documentation sets, multi-repo documentation

4. **You want machine-enforceable documentation**
   - CI/CD must validate documents
   - Automated audits before commits
   - Schema validation for document metadata
   - Example: Teams treating docs as infrastructure

5. **You follow constitutional governance models**
   - Documents derive from LAW documents
   - RFCs propose changes to constitutional framework
   - Clear authority chains required
   - Example: AIBOS-style systems, constitutional document governance

### ❌ **Don't Use This Package When:**

1. **Simple documentation**
   - Just need basic Markdown files
   - No governance requirements
   - No structured metadata needed
   - **Use instead:** Regular Markdown, simple docs tools

2. **Casual documentation**
   - Personal projects
   - Quick notes
   - No compliance needs
   - **Use instead:** Any simple documentation tool

3. **You don't need validation**
   - Documents are free-form
   - No structure requirements
   - No audit needs
   - **Use instead:** Standard documentation tools (GitBook, Notion, etc.)

4. **You don't need lineage**
   - Documents don't derive from each other
   - No authority chains
   - No constitutional model
   - **Use instead:** Simple documentation systems

### 🤔 **Maybe Use This Package When:**

- You're starting a new project and want structured documentation from day one
- You have documentation that might need governance in the future
- You want to experiment with constitutional document models
- You need some structure but not full governance (you can use it partially)

---

## Real-World Use Cases

### ✅ **Perfect Fit:**

1. **Enterprise Architecture Documentation**
   - ADRs, PRDs, SRS documents
   - Need to track decisions and requirements
   - Compliance and audit requirements

2. **Regulated Industries**
   - Financial services, healthcare, government
   - Documents must be validated and auditable
   - Clear ownership and versioning required

3. **Constitutional Governance Systems**
   - AIBOS-style systems
   - Documents derive from constitutional LAW
   - RFCs propose changes to framework

4. **Large-Scale Documentation**
   - Monorepos with many packages
   - Cross-repo documentation
   - Need INDEX synchronization

### ❌ **Not a Good Fit:**

1. **Personal Blogs**
   - Just writing articles
   - No governance needs
   - **Better:** Jekyll, Hugo, simple Markdown

2. **Simple README Files**
   - Just project documentation
   - No structured types
   - **Better:** Regular Markdown

3. **Quick Notes**
   - Meeting notes, personal docs
   - No validation needed
   - **Better:** Notion, Obsidian, simple tools

---

## The Bottom Line

**This package is helpful when:**
- You need **governance** (not just documentation)
- You need **machine-enforceable** document structure
- You need **validation, audits, and compliance**
- You follow **constitutional or hierarchical** document models

**This package is NOT helpful when:**
- You just need **simple documentation**
- You don't need **validation or governance**
- Your documents are **free-form and casual**

**Think of it this way:**
- **Regular docs tools** = Write and read documents
- **This package** = Govern, validate, audit, and enforce document structure

If you're asking "do I need this?", you probably don't. But if you're asking "how do I enforce document governance?", this is the answer.

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

## Getting Started (5 Minutes)

**Want to get started quickly?** Follow these steps:

1. **Install the package** (see above)

2. **Create your first document:**
   ```bash
   mkdir -p docs/PRD/PRD-001
   ```

3. **Create `docs/PRD/PRD-001/doc.json`:**
   ```json
   {
     "document_id": "PRD-001",
     "document_type": "PRD",
     "classification": "STANDARD",
     "title": "My First Document",
     "status": "DRAFT",
     "authority": "DERIVED",
     "scope": "KERNEL",
     "derived_from": [],
     "version": "0.1.0",
     "owners": ["Your Name"],
     "checksum_sha256": null,
     "created_at": "2026-01-01",
     "updated_at": "2026-01-01"
   }
   ```

4. **Create `docs/PRD/PRD-001/doc.md`:**
   ```markdown
   # PRD-001 — My First Document
   
   Your content here.
   ```

5. **Generate managed blocks:**
   ```ts
   import { generateDocs } from "@aibos/docs-registry";
   await generateDocs({ docsDir: "docs" });
   ```

6. **Generate INDEX:**
   ```ts
   import { generateIndex } from "@aibos/docs-registry";
   await generateIndex({ docsDir: "docs" });
   ```

7. **Run audit:**
   ```ts
   import { auditAll } from "@aibos/docs-registry";
   const result = await auditAll({ docsDir: "docs" });
   console.log(result.passed ? "✅ All good!" : "❌ Issues found");
   ```

**That's it!** You now have a governed document system.

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

Documents are not "written".
They are **compiled**.

---

## Constitutional Model

This SDK supports a **3-Tier Constitutional Model** (see `RFC-KERNEL-001`):

### Important: Constitution vs LAW

- **Constitution** = The overall 3-Tier Constitutional Model (the framework/system)
- **LAW** = Individual constitutional law documents (e.g., `LAW-001`, `LAW-002`)
- **Constitutional Laws** = The collection of all LAW documents that form the foundation

**Think of it this way:**
- The **Constitution** is the model/framework (like a country's constitution)
- **LAW documents** are individual laws within that constitution (like articles/amendments)

### Tier 1: Constitutional Laws (LAW Documents)
- **Foundational philosophy** — Human truths that rarely change
- **Example:** `LAW-001` — A foundational constitutional law
- **Purpose:** Define culture, philosophy, and intent
- **Note:** Multiple LAW documents can exist (LAW-001, LAW-002, etc.)

### Tier 2: Enforcement Doctrines
- **Required mechanisms** — Non-optional mechanics to enforce Tier 1
- **Example:** Registry is the sole semantic authority
- **Purpose:** Make constitutional laws real and enforceable

### Tier 3: Enforcement Surface
- **Execution reality** — Required capabilities and enforcement gates
- **Example:** Semantic registry validation, override creation
- **Purpose:** Provide concrete mechanisms for governance

### RFC's Role in Constitutional Evolution

**RFC (Request for Comments)** is the mechanism for proposing changes to the Constitution or new LAW documents:

- **RFCs derive from LAW** — All RFCs must reference existing LAW documents (e.g., `LAW-001`)
- **RFCs propose changes** — They suggest new constitutional structures, new LAW documents, or modifications
- **RFCs can become LAW** — When approved, RFCs can become new LAW documents
- **Example:** `RFC-KERNEL-001` proposes the 3-Tier Constitutional Model itself (derived from `LAW-001`)

**Constitutional Flow:**

```
LAW-001 (A foundational constitutional law)
    ↓
RFC-KERNEL-001 (Proposes 3-Tier Model) ← Derived from LAW-001
    ↓
[If approved] → May become LAW-002 or part of constitutional framework
    ↓
Other documents derive from LAW documents
```

**Why This Matters:**

- **Constitutional stability** — LAW documents rarely change, preserving foundational truths
- **Controlled evolution** — RFCs provide a formal process for proposing new LAW documents or constitutional changes
- **Clear lineage** — Every document traces back to LAW documents (the constitutional foundation)
- **Machine-enforceable** — This SDK enforces the constitutional model via schemas

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

### Step 1: Install the Package

```bash
npm install @aibos/docs-registry
# or
pnpm add @aibos/docs-registry
```

### Step 2: Set Up Your Document Structure

Create a `docs` folder with your document structure:

```
docs/
├── PRD/
│   └── PRD-001/
│       ├── doc.json    ← Create this first
│       └── doc.md      ← Create this second
└── ADR/
    └── ADR-001/
        ├── doc.json
        └── doc.md
```

### Step 3: Create Your First Document

**Create `docs/PRD/PRD-001/doc.json`:**

```json
{
  "document_id": "PRD-001",
  "document_type": "PRD",
  "classification": "STANDARD",
  "title": "My First Product Requirements",
  "status": "DRAFT",
  "authority": "DERIVED",
  "scope": "KERNEL",
  "derived_from": [],
  "version": "0.1.0",
  "owners": ["Your Name"],
  "checksum_sha256": null,
  "created_at": "2026-01-01",
  "updated_at": "2026-01-01"
}
```

**Create `docs/PRD/PRD-001/doc.md`:**

```markdown
# PRD-001 — My First Product Requirements

Your content goes here. The managed block will be automatically generated.
```

### Step 4: Generate Managed Blocks

```ts
import { generateDocs } from "@aibos/docs-registry";

// This will:
// 1. Validate all doc.json files
// 2. Generate managed header blocks in doc.md files
// 3. Calculate checksums
await generateDocs({ docsDir: "docs" });
```

**After generation, your `doc.md` will have:**

```markdown
<!-- BEGIN: AIBOS_MANAGED -->
| Field | Value |
|---|---|
| **Document ID** | PRD-001 |
| **Status** | DRAFT |
| **Version** | 0.1.0 |
<!-- END: AIBOS_MANAGED -->

# PRD-001 — My First Product Requirements

Your content goes here.
```

### Step 5: Generate INDEX

```ts
import { generateIndex } from "@aibos/docs-registry";

// Creates docs/INDEX.md with all documents
await generateIndex({ docsDir: "docs" });
```

### Step 6: Run Audits

```ts
import { auditAll } from "@aibos/docs-registry";

const result = await auditAll({ docsDir: "docs" });

if (!result.passed) {
  console.error("❌ Audit failed:");
  result.violations.forEach(v => {
    console.error(`  - ${v.docId}: ${v.message}`);
  });
  process.exit(1);
}

console.log("✅ All checks passed");
```

---

## Common Use Cases

### Use Case 1: Validate a Single Document

```ts
import { DocJsonSchema } from "@aibos/docs-registry/schema";
import fs from "node:fs";

const raw = JSON.parse(fs.readFileSync("docs/PRD/PRD-001/doc.json", "utf8"));
const result = DocJsonSchema.safeParse(raw);

if (!result.success) {
  console.error("Validation errors:");
  result.error.issues.forEach(issue => {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  });
  process.exit(1);
}

console.log("✅ Document is valid:", result.data.document_id);
```

### Use Case 2: Create a Script to Generate All Docs

**Create `scripts/generate-docs.ts`:**

```ts
import { generateDocs, generateIndex } from "@aibos/docs-registry";

async function main() {
  const docsDir = "docs";
  
  console.log("📄 Generating documents...");
  await generateDocs({ docsDir });
  
  console.log("📑 Generating INDEX...");
  await generateIndex({ docsDir });
  
  console.log("✅ Done!");
}

main().catch(console.error);
```

**Add to `package.json`:**

```json
{
  "scripts": {
    "docs:generate": "tsx scripts/generate-docs.ts"
  }
}
```

**Run it:**

```bash
npm run docs:generate
```

### Use Case 3: CI/CD Integration

**Create `.github/workflows/docs-audit.yml`:**

```yaml
name: Document Audit

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: pnpm install
      - run: pnpm docs:generate
      - run: pnpm docs:audit
```

**Add audit script to `package.json`:**

```json
{
  "scripts": {
    "docs:audit": "tsx -e \"import('@aibos/docs-registry').then(m => m.auditAll({ docsDir: 'docs' }).then(r => { if (!r.passed) { console.error('Audit failed'); process.exit(1); } }))\""
  }
}
```

### Use Case 4: Create Documents Programmatically

```ts
import { DocJsonSchema, type DocJson } from "@aibos/docs-registry/schema";
import fs from "node:fs";
import path from "node:path";

async function createDocument(
  docId: string,
  docType: string,
  title: string,
  content: string
) {
  const docDir = path.join("docs", docType, docId);
  fs.mkdirSync(docDir, { recursive: true });

  // Create doc.json
  const docJson: DocJson = {
    document_id: docId,
    document_type: docType,
    classification: "STANDARD",
    title,
    status: "DRAFT",
    authority: "DERIVED",
    scope: "KERNEL",
    derived_from: [],
    version: "0.1.0",
    owners: ["System"],
    checksum_sha256: null,
    created_at: new Date().toISOString().split("T")[0],
    updated_at: new Date().toISOString().split("T")[0],
  };

  // Validate
  const result = DocJsonSchema.safeParse(docJson);
  if (!result.success) {
    throw new Error(`Invalid document: ${result.error.message}`);
  }

  // Write files
  fs.writeFileSync(
    path.join(docDir, "doc.json"),
    JSON.stringify(docJson, null, 2)
  );
  fs.writeFileSync(path.join(docDir, "doc.md"), content);

  // Generate managed blocks
  const { generateDocs } = await import("@aibos/docs-registry");
  await generateDocs({ docsDir: "docs" });

  console.log(`✅ Created document: ${docId}`);
}

// Usage
await createDocument(
  "PRD-002",
  "PRD",
  "New Feature Requirements",
  "# PRD-002 — New Feature Requirements\n\nFeature description..."
);
```

### Use Case 5: Check Document Status

```ts
import { discoverDocs } from "@aibos/docs-registry";

const docs = await discoverDocs("docs");

console.log("Document Status:");
docs.forEach(doc => {
  console.log(`  ${doc.docId}: ${doc.docJson.status} (v${doc.docJson.version})`);
});
```

---

## Complete Example: Full Workflow

Here's a complete example showing the full workflow:

```ts
import {
  generateDocs,
  generateIndex,
  auditAll,
  discoverDocs,
} from "@aibos/docs-registry";

async function main() {
  const docsDir = "docs";

  // 1. Discover all documents
  console.log("📋 Discovering documents...");
  const docs = await discoverDocs(docsDir);
  console.log(`   Found ${docs.length} documents`);

  // 2. Generate managed blocks and checksums
  console.log("📄 Generating managed blocks...");
  const genResult = await generateDocs({ docsDir });
  console.log(`   Processed: ${genResult.processed} documents`);
  console.log(`   Updated: ${genResult.updated.length} documents`);

  // 3. Generate INDEX
  console.log("📑 Generating INDEX...");
  await generateIndex({ docsDir });
  console.log("   ✅ INDEX.md created");

  // 4. Run full audit
  console.log("🔍 Running audit...");
  const auditResult = await auditAll({ docsDir });

  if (auditResult.passed) {
    console.log("   ✅ All checks passed");
  } else {
    console.error("   ❌ Audit failed:");
    auditResult.violations.forEach(v => {
      console.error(`      - ${v.docId}: ${v.message}`);
    });
    process.exit(1);
  }

  console.log("\n✅ All operations completed successfully!");
}

main().catch(console.error);
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

| Type | Level | Purpose                     | Authority Chain                              |
| ---- | ----- | --------------------------- | -------------------------------------------- |
| LAW  | 1     | Constitutional law documents | Original (constitutional foundation)         |
| RFC  | —     | Proposals (pre-decision)     | Derived from LAW (proposes new LAW or changes) |
| PRD  | 2     | Product intent & boundaries  | Derived from LAW/RFC                         |
| SRS  | 3     | System requirements         | Derived from PRD                             |
| ADR  | 4     | Architecture decisions      | Derived from SRS                             |
| TSD  | 5     | Technical specification     | Derived from ADR                              |
| SOP  | 6     | Operating procedures        | Derived from TSD                              |

**Note:** The **Constitution** is the overall 3-Tier Constitutional Model framework. **LAW** documents are individual constitutional laws within that framework.

### Document Hierarchy & Authority

Documents follow a **constitutional hierarchy**:

```
Constitution (3-Tier Model)
  ↓
LAW Documents (e.g., LAW-001, LAW-002) ← Constitutional foundation
  ↓
RFC (Proposals) ← Proposes new LAW documents or constitutional changes
  ↓
PRD (Product Requirements)
  ↓
SRS (System Requirements)
  ↓
ADR (Architecture Decisions)
  ↓
TSD (Technical Specifications)
  ↓
SOP (Operating Procedures)
```

**Key Relationships:**

- **Constitution** = The overall 3-Tier Constitutional Model (the framework)
- **LAW** = Individual constitutional law documents (e.g., `LAW-001`, `LAW-002`)
  - LAW documents form the constitutional foundation
  - They rarely change, preserving foundational truths
- **RFC** = Proposals that may become new LAW documents or propose constitutional changes
  - Example: `RFC-KERNEL-001` proposes the 3-Tier Constitutional Model itself
  - RFCs derive from existing LAW documents (e.g., `LAW-001`)
- **All other types** derive from LAW documents (directly or via RFC)

**Example Flow:**

1. **LAW-001** exists as a foundational constitutional law
2. **RFC-KERNEL-001** proposes the 3-Tier Constitutional Model (derived from `LAW-001`)
3. If approved, RFC may become a new LAW document (e.g., `LAW-002`) or part of the constitutional framework
4. **PRD-DOCSREG-001** derives from `LAW-001` and `RFC-DOCSREG-001`
5. **SRS-DOCSREG-001** derives from `PRD-DOCSREG-001`
6. And so on down the hierarchy

**Why RFC Matters:**

- RFCs are **proposals** before they become LAW documents or other document types
- They allow **constitutional evolution** without breaking existing LAW documents
- They provide a **formal process** for proposing new LAW documents or structural changes
- They maintain **lineage** back to LAW documents (the constitutional foundation)

---

## API Reference

### Main Exports

**From `@aibos/docs-registry`:**

```ts
import {
  // Generation
  generateDocs,        // Generate managed blocks and checksums
  generateIndex,       // Generate INDEX.md
  
  // Auditing
  auditAll,            // Run all audits
  auditIndex,          // Audit INDEX sync
  auditChecksum,       // Audit checksums
  auditOrphans,        // Find orphan documents
  
  // Discovery
  discoverDocs,        // Scan and discover documents
  
  // Utilities
  computeChecksum,     // Calculate content checksum
  normalizeContent,   // Normalize content for checksum
} from "@aibos/docs-registry";
```

**From `@aibos/docs-registry/schema`:**

```ts
import {
  // Schemas
  DocJsonSchema,       // Validate doc.json
  
  // Types
  DocumentType,        // "PRD" | "ADR" | "SRS" | etc.
  DocumentStatus,      // "DRAFT" | "APPROVED" | etc.
  AuthorityLevel,      // "DERIVED" | "ORIGINAL" | etc.
  
  // TypeScript Types
  type DocJson,        // TypeScript type for doc.json
} from "@aibos/docs-registry/schema";
```

### Configuration

```ts
interface DocsRegistryConfig {
  docsDir: string;              // Required: Path to docs directory
  templatesDir?: string;        // Optional: Custom templates directory
  checksumAlgorithm?: "sha256"; // Optional: Checksum algorithm (default: sha256)
}
```

### Function Signatures

#### `generateDocs(config: DocsRegistryConfig): Promise<GenerateResult>`

Generates managed blocks and calculates checksums for all documents.

**Returns:**
```ts
{
  processed: number;      // Total documents processed
  updated: string[];      // Document IDs that were updated
  errors: Array<{         // Errors encountered
    docId: string;
    error: string;
  }>;
}
```

#### `generateIndex(config: DocsRegistryConfig): Promise<void>`

Generates `INDEX.md` from discovered documents.

#### `auditAll(config: DocsRegistryConfig): Promise<AuditResult>`

Runs all audit checks (schema, checksum, index, orphans).

**Returns:**
```ts
{
  passed: boolean;
  violations: Array<{
    docId: string;
    check: string;        // "schema" | "checksum" | "index" | "orphan"
    message: string;
  }>;
}
```

#### `discoverDocs(docsDir: string): Promise<DiscoveredDoc[]>`

Scans filesystem and discovers all documents.

**Returns:**
```ts
Array<{
  docId: string;
  docJson: DocJson;
  docJsonPath: string;
  docMdPath: string;
}>
```

---

## Governance Rules (Non-Negotiable)

### ✅ DO

* Treat `doc.json` as SSOT
* Generate, never hand-edit managed blocks
* Run audits before commit
* **Use RFCs for structural change** — Propose constitutional changes via RFC
* **Derive from LAW** — All documents must trace back to LAW documents (the constitutional foundation)
* **Maintain lineage** — Always specify `derived_from` in `doc.json`

### ❌ DON'T

* Edit generated sections
* Skip audits
* Rely on tribal memory
* Treat docs as free-text
* **Create documents without constitutional lineage** — Always derive from LAW or RFC
* **Change LAW documents directly** — Use RFC to propose new LAW documents or constitutional changes

---

## Troubleshooting

### Common Issues

#### Issue: "Document validation failed"

**Solution:** Check your `doc.json` structure. Use the schema:

```ts
import { DocJsonSchema } from "@aibos/docs-registry/schema";

const result = DocJsonSchema.safeParse(yourDocJson);
if (!result.success) {
  console.error(result.error.issues);
}
```

#### Issue: "Checksum mismatch"

**Solution:** Regenerate the document:

```ts
await generateDocs({ docsDir: "docs" });
```

This will recalculate checksums based on current content.

#### Issue: "INDEX out of sync"

**Solution:** Regenerate the INDEX:

```ts
await generateIndex({ docsDir: "docs" });
```

#### Issue: "Orphan documents found"

**Solution:** Either:
1. Add the document to INDEX by regenerating it
2. Remove the orphan document if it's not needed

#### Issue: "Module not found" errors

**Solution:** Make sure you're using the correct import paths:

```ts
// ✅ Correct
import { generateDocs } from "@aibos/docs-registry";
import { DocJsonSchema } from "@aibos/docs-registry/schema";

// ❌ Wrong
import { generateDocs } from "@aibos/docs-registry/core";
```

### Need Help?

- Check the [examples in the `docs/` folder](./docs/) in this package
- Review the [API Reference](#api-reference) below
- Open an [issue on GitHub](https://github.com/pohlai88/NEXUS-DOCS-REGISTRY/issues)

---

## Design Philosophy

This SDK is intentionally strict.

It exists to eliminate:

* Silent drift
* Broken lineage
* Inconsistent documents
* "Out-of-date but nobody noticed" failures

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
