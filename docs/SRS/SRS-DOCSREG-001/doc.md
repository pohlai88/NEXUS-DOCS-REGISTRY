<!-- BEGIN: AIBOS_MANAGED -->
| Field | Value | |---|---| | **Document ID** |
SRS-DOCSREG-001
| | **Document Type** |
SRS
| | **Classification** |
STANDARD
| | **Title** |
Document Registry SDK System Requirements Specification
| | **Status** |
DRAFT
| | **Authority** |
DERIVED
| | **Derived From** |
`LAW-001`,
    `PRD-DOCSREG-001`
| | **Version** |
0.1.0
| | **Owners** |
`Poh Lai`
| | **Checksum (SHA-256)** |
`5196a7ea7525b96c3de97d01fe33bfa4d6a241566b1892db1ac59415b69210dc`
| | **Updated** |
2026-01-01
|
<!-- END: AIBOS_MANAGED -->











# SRS-DOCSREG-001 — Document Registry SDK System Requirements Specification

## Abstract

This SRS defines the system requirements for `@aibos/docs-registry`. It specifies interfaces, data structures, algorithms, and behavioral contracts that implement the product requirements from PRD-DOCSREG-001.

---

## §1 — Interfaces

### §1.1 — Schema Exports

The SDK SHALL export the following Zod schemas:

```typescript
// @aibos/docs-registry/schema
export const DocumentType: z.ZodEnum<["LAW", "PRD", "SRS", "ADR", "TSD", "SOP", "RFC"]>;
export const DocumentStatus: z.ZodEnum<["DRAFT", "REVIEW", "APPROVED", "IMPLEMENTED", "SUPERSEDED", "DEPRECATED"]>;
export const AuthorityLevel: z.ZodEnum<["ABSOLUTE", "DERIVED"]>;
export const DocJsonSchema: z.ZodObject<...>;
export type DocJson = z.infer<typeof DocJsonSchema>;
```

**Traces To:** PRD-DOCSREG-001 FR1

### §1.2 — Core Function Signatures

```typescript
// @aibos/docs-registry

interface DocsRegistryConfig {
  /** Root directory containing docs (default: "docs") */
  docsDir: string;
  /** Custom templates directory (optional) */
  templatesDir?: string;
  /** Checksum algorithm (default: "sha256") */
  checksumAlgorithm?: "sha256" | "sha512";
}

interface GenerateResult {
  /** Number of documents processed */
  processed: number;
  /** Documents that were updated */
  updated: string[];
  /** Documents with errors */
  errors: Array<{ docId: string; error: string }>;
}

interface AuditResult {
  /** Overall pass/fail */
  passed: boolean;
  /** List of violations */
  violations: Violation[];
}

interface Violation {
  /** Type of violation */
  type: "INVALID_SCHEMA" | "CHECKSUM_MISMATCH" | "PHANTOM_DOC" | "MISSING_DOC";
  /** Document ID */
  docId: string;
  /** Human-readable message */
  message: string;
  /** Path to document */
  path: string;
}

export function generateDocs(
  config: DocsRegistryConfig
): Promise<GenerateResult>;
export function generateIndex(config: DocsRegistryConfig): Promise<void>;
export function auditAll(config: DocsRegistryConfig): Promise<AuditResult>;
export function auditIndex(config: DocsRegistryConfig): Promise<AuditResult>;
export function auditChecksum(config: DocsRegistryConfig): Promise<AuditResult>;
export function auditOrphans(config: DocsRegistryConfig): Promise<AuditResult>;
export function createStandardSet(options: {
  pack: string;
  outputDir: string;
}): Promise<GenerateResult>;
```

**Traces To:** PRD-DOCSREG-001 FR2, FR3, FR4, FR5

---

## §2 — Data Structures

### §2.1 — doc.json Schema Fields

| Field             | Type                  | Required | Description                                                      |
| ----------------- | --------------------- | -------- | ---------------------------------------------------------------- |
| `document_id`     | `string`              | ✅       | Pattern: `^(LAW\|PRD\|SRS\|ADR\|TSD\|SOP\|RFC)-[A-Z0-9]+-\d{3}$` |
| `document_type`   | `DocumentType`        | ✅       | One of: LAW, PRD, SRS, ADR, TSD, SOP, RFC                        |
| `classification`  | `string`              | ✅       | e.g., "CONSTITUTION", "STANDARD", "PROPOSAL"                     |
| `title`           | `string`              | ✅       | Human-readable title                                             |
| `abstract`        | `string`              | ❌       | Brief description                                                |
| `status`          | `DocumentStatus`      | ✅       | Lifecycle status                                                 |
| `authority`       | `AuthorityLevel`      | ✅       | ABSOLUTE or DERIVED                                              |
| `scope`           | `string`              | ✅       | e.g., "KERNEL", "PLATFORM"                                       |
| `derived_from`    | `string[]`            | ❌       | Parent document IDs                                              |
| `supersedes`      | `string[]`            | ❌       | Superseded document IDs                                          |
| `version`         | `string`              | ✅       | Semver: `^\d+\.\d+\.\d+$`                                        |
| `owners`          | `string[]`            | ❌       | Responsible parties                                              |
| `checksum_sha256` | `string \| null`      | ❌       | Computed by SDK                                                  |
| `implemented`     | `ImplementedClause[]` | ❌       | LAW-001 clause evidence                                          |
| `approvals`       | `ApprovalRecord[]`    | ❌       | Approval history                                                 |
| `created_at`      | `string`              | ✅       | ISO date: `^\d{4}-\d{2}-\d{2}$`                                  |
| `updated_at`      | `string`              | ✅       | ISO date: `^\d{4}-\d{2}-\d{2}$`                                  |

**Traces To:** PRD-DOCSREG-001 FR1, LAW-001 §C3

### §2.2 — Managed Block Format

```markdown
<!-- BEGIN: AIBOS_MANAGED -->

| Field                  | Value               |
| ---------------------- | ------------------- |
| **Document ID**        | {{document_id}}     |
| **Document Type**      | {{document_type}}   |
| **Classification**     | {{classification}}  |
| **Title**              | {{title}}           |
| **Status**             | {{status}}          |
| **Authority**          | {{authority}}       |
| **Derived From**       | {{derived_from}}    |
| **Version**            | {{version}}         |
| **Owners**             | {{owners}}          |
| **Checksum (SHA-256)** | {{checksum_sha256}} |
| **Updated**            | {{updated_at}}      |

<!-- END: AIBOS_MANAGED -->
```

**Invariant:** Content between markers is overwritten on every `generateDocs()` call.

**Traces To:** PRD-DOCSREG-001 FR2

---

## §3 — Algorithms

### §3.1 — Checksum Computation

```
INPUT:  doc.md file content
OUTPUT: SHA-256 hex string (64 characters)

ALGORITHM:
1. Read file as UTF-8
2. Normalize line endings: replace CRLF with LF
3. Trim trailing whitespace from each line
4. Trim trailing newlines from end of file
5. Compute SHA-256 hash
6. Return lowercase hex string
```

**Rationale:** Normalization ensures checksums are stable across Windows/Unix.

**Traces To:** PRD-DOCSREG-001 FR6, FR9

### §3.2 — Document Discovery

```
INPUT:  docsDir path
OUTPUT: Array of { docJsonPath, docMdPath, docJson }

ALGORITHM:
1. Glob pattern: `${docsDir}/**/doc.json`
2. For each doc.json:
   a. Parse JSON
   b. Validate against DocJsonSchema
   c. Locate sibling doc.md
   d. Add to results
3. Sort by document_id (deterministic ordering)
4. Return results
```

**Traces To:** PRD-DOCSREG-001 FR2, FR3

### §3.3 — INDEX Generation

```
INPUT:  Array of DocJson
OUTPUT: INDEX.md content

ALGORITHM:
1. Sort documents by document_id alphabetically
2. Generate header:
```

# Document Index (Generated)

> DO NOT hand-edit. Generated by `@aibos/docs-registry`.

```
3. Generate table header
4. For each document:
a. Extract: id, title, version, status, authority, checksum, path
b. Append table row
5. Return markdown string
```

**Invariant:** Same input always produces byte-identical output.

**Traces To:** PRD-DOCSREG-001 FR3

### §3.4 — Orphan Detection

```
INPUT:  INDEX.md content, filesystem doc.json paths
OUTPUT: Array of Violation

ALGORITHM:
1. Parse INDEX.md to extract document IDs
2. Scan filesystem for all doc.json files, extract document IDs
3. PHANTOM = INDEX IDs not in filesystem
4. MISSING = filesystem IDs not in INDEX
5. Return violations for each
```

**Traces To:** PRD-DOCSREG-001 FR7, FR8

---

## §4 — Behavioral Contracts

### §4.1 — Idempotency

> Running `generateDocs()` twice in succession with no changes MUST produce identical output.

**Verification:** Snapshot test

### §4.2 — Determinism

> Given identical filesystem state, `generateIndex()` MUST produce byte-identical INDEX.md.

**Verification:** Hash comparison test

### §4.3 — Fail-Fast

> If any doc.json fails schema validation, `generateDocs()` MUST throw before modifying any files.

**Rationale:** Prevent partial updates that corrupt state.

### §4.4 — Non-Destructive

> `generateDocs()` MUST NOT modify content outside the managed block markers.

**Verification:** Diff test on doc.md files

---

## §5 — Error Handling

### §5.1 — Schema Validation Errors

```typescript
class DocSchemaError extends Error {
  constructor(
    public docId: string,
    public path: string,
    public zodError: z.ZodError
  ) {
    super(`Invalid doc.json: ${docId}`);
  }
}
```

### §5.2 — Filesystem Errors

```typescript
class DocFilesystemError extends Error {
  constructor(
    public path: string,
    public operation: "read" | "write" | "glob",
    public cause: Error
  ) {
    super(`Filesystem error: ${operation} ${path}`);
  }
}
```

### §5.3 — Audit Violations

Audit functions MUST NOT throw for violations. They return `AuditResult` with `passed: false`.

---

## §6 — Templates

### §6.1 — Default Template Directory

```
src/templates/
  header.md.hbs
  PRD.body.md.hbs
  SRS.body.md.hbs
  ADR.body.md.hbs
  TSD.body.md.hbs
  SOP.body.md.hbs
  LAW.body.md.hbs
  RFC.body.md.hbs
```

### §6.2 — Template Override

If `config.templatesDir` is provided:

1. Load templates from custom directory
2. Fall back to default templates for missing files

**Traces To:** PRD-DOCSREG-001 FR10

---

## §7 — Traceability Matrix

| SRS Requirement          | PRD Requirement    | LAW-001 Clause |
| ------------------------ | ------------------ | -------------- |
| §1.1 Schema Exports      | FR1                | §C3            |
| §1.2 Function Signatures | FR2, FR3, FR4, FR5 | —              |
| §2.1 doc.json Schema     | FR1                | §C3            |
| §2.2 Managed Block       | FR2                | —              |
| §3.1 Checksum            | FR6, FR9           | —              |
| §3.3 INDEX Generation    | FR3                | —              |
| §3.4 Orphan Detection    | FR7, FR8           | §C5            |

---

## References

- [PRD-DOCSREG-001](../PRD/PRD-DOCSREG-001/doc.md) — Product Requirements
- [RFC-DOCSREG-001](../RFC/RFC-DOCSREG-001/doc.md) — Original Proposal
- [LAW-001 §C3](../../../../docs/registered/LAW-001.md#c3--mandatory-registry-fields) — Mandatory Registry Fields
- [LAW-001 §C5](../../../../docs/registered/LAW-001.md#c5--anti-orphan-rules) — Anti-Orphan Rules

---

_Created: 2026-01-01_
