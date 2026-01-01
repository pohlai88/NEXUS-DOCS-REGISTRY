<!-- BEGIN: AIBOS_MANAGED -->
| Field | Value | |---|---| | **Document ID** |
RFC-DOCSREG-001
| | **Document Type** |
RFC
| | **Classification** |
PROPOSAL
| | **Title** |
Document Registry SDK (@aibos/docs-registry)
| | **Status** |
DRAFT
| | **Authority** |
DERIVED
| | **Derived From** |
`LAW-001`
| | **Version** |
0.1.0
| | **Owners** |
`Poh Lai`
| | **Checksum (SHA-256)** |
`5c20bea11be66b74981a3ba05433f2cea9c5e2f807fbb8fd167a8ca457be6be2`
| | **Updated** |
2026-01-01
|
<!-- END: AIBOS_MANAGED -->



# RFC-DOCSREG-001 — Document Registry SDK

## Abstract

This RFC proposes the creation of `@aibos/docs-registry`, an NPM-pure governance SDK that provides:

- **Zod schemas** for document validation (doc.json)
- **Deterministic generation** of managed header blocks
- **Checksum enforcement** for content integrity
- **INDEX generation** from filesystem scan
- **Audit functions** for drift detection
- **Standard packs** for bulk document scaffolding

The SDK is designed to be **publishable** — any repository can install it and gain document governance instantly.

---

## Problem Statement

### Current State

1. **No machine-enforceable document structure** — Documents are free-form Markdown with no validated metadata
2. **INDEX drift** — Manual INDEX.md edits lead to phantom docs and missing entries
3. **Checksum absence** — No content integrity verification
4. **Governance is repo-specific** — Scripts exist but are not reusable across projects

### Consequences

- LAW-001 clauses cannot be machine-verified
- Document authority chains are not enforced
- Onboarding new repos requires re-implementing governance

---

## Proposed Solution

### Core Principle

> **NPM-pure library, not CLI tool.**
>
> Everything exposed as **functions + schemas**.
> Any repo can `npm install @aibos/docs-registry` and get governance instantly.

### What the SDK IS

| Capability         | Description                                                                    |
| ------------------ | ------------------------------------------------------------------------------ |
| **Zod Schemas**    | `DocJsonSchema` validates doc.json metadata                                    |
| **Generation**     | `generateDocs()` renders managed header blocks, computes checksums             |
| **INDEX**          | `generateIndex()` scans filesystem, produces deterministic INDEX.md            |
| **Audits**         | `auditAll()` enforces schema validity, checksum correctness, INDEX consistency |
| **Standard Packs** | `createStandardSet()` scaffolds dozens/hundreds of docs from templates         |

### What the SDK IS NOT

| Not                      | Reason                                  |
| ------------------------ | --------------------------------------- |
| ❌ CLI tool              | NPM-pure library pattern                |
| ❌ Migration utility     | Consumers handle their own migrations   |
| ❌ Kernel doctrine owner | Kernel owns LAW-001, SDK owns mechanics |
| ❌ Repo-specific logic   | Portable across any repo                |

---

## Storage Model

### Folder-Based Document Unit

```
docs/<TYPE>/<DOC-ID>/
  doc.json   ← SSOT (machine-validated)
  doc.md     ← human content + managed block
```

### doc.json (SSOT)

- Validated by `DocJsonSchema`
- Contains: id, type, status, authority, derived_from, version, owners, approvals
- Checksum is **derived** (computed by SDK), not authored

### doc.md (Human)

- Free-form writing
- One auto-managed block:

```markdown
<!-- BEGIN: AIBOS_MANAGED -->

...

<!-- END: AIBOS_MANAGED -->
```

- Everything else is human-owned

### INDEX.md

- **Generated only** — no manual edits
- Sorted deterministically
- Contains: doc id, title, version, status, authority, checksum, path

---

## API Surface

### Schema Exports

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
  /** Root directory for docs (default: "docs") */
  docsDir: string;
  /** Custom templates directory (optional) */
  templatesDir?: string;
  /** Checksum algorithm (default: "sha256") */
  checksumAlgorithm?: "sha256" | "sha512";
}
```

---

## Audit Guarantees

`auditAll()` enforces:

| Check                    | Description                                        |
| ------------------------ | -------------------------------------------------- |
| **Schema Validity**      | All doc.json files pass `DocJsonSchema.parse()`    |
| **Checksum Correctness** | Computed checksum matches stored checksum          |
| **INDEX → FS**           | Every entry in INDEX.md exists on filesystem       |
| **FS → INDEX**           | Every doc.json on filesystem is in INDEX.md        |
| **Determinism**          | Running `generateDocs()` produces no diff if clean |

---

## Standard Packs

Instead of migration, generate.

```typescript
createStandardSet({
  pack: "kernel-governance-v1",
  outputDir: "docs",
});
```

This scaffolds standard governance docs with:

- Pre-filled metadata
- Body templates
- Computed checksums
- Generated INDEX

---

## Acceptance Criteria

| #   | Criterion                                                     | Verification        |
| --- | ------------------------------------------------------------- | ------------------- |
| 1   | `DocJsonSchema` validates all doc.json fields                 | Unit test           |
| 2   | `generateDocs()` produces managed header blocks               | Integration test    |
| 3   | `generateIndex()` is deterministic (same input → same output) | Snapshot test       |
| 4   | `auditAll()` catches invalid schema                           | Unit test           |
| 5   | `auditAll()` catches checksum mismatch                        | Unit test           |
| 6   | `auditAll()` catches phantom docs (INDEX → FS)                | Unit test           |
| 7   | `auditAll()` catches missing docs (FS → INDEX)                | Unit test           |
| 8   | `createStandardSet()` scaffolds multiple docs                 | Integration test    |
| 9   | Package exports types correctly                               | tsc --noEmit        |
| 10  | Package publishes to npm                                      | Manual verification |

---

## Open Questions

1. **Schema alignment with @aibos/kernel** — Should `DocJsonSchema` import types from kernel (creating dependency), or stay standalone?

   - **Recommendation:** Standalone. Kernel owns doctrine, docs-registry owns mechanics.

2. **Template extensibility** — Full override only, or partial overrides?

   - **Recommendation:** Full override only initially. Defer partials until real need.

3. **Publish scope** — Public npm or private GitHub Package Registry first?
   - **Recommendation:** Private first, public after v1.0 stabilizes.

---

## Next Steps

1. ✅ Create RFC-DOCSREG-001 (this document)
2. ⬜ Create PRD-DOCSREG-001 (product requirements)
3. ⬜ Create SRS-DOCSREG-001 (system requirements)
4. ⬜ Create ADR-DOCSREG-001 (architecture decision)
5. ⬜ Create TSD-DOCSREG-001 (technical specification)
6. ⬜ Create SOP-DOCSREG-001 (operating procedures)
7. ⬜ Implement SDK
8. ⬜ Update LAW-001 with implementation evidence

---

## References

- [LAW-001 — Constitution](../../../docs/registered/LAW-001.md)
- [LAW-001 §C3 — Mandatory Registry Fields](../../../docs/registered/LAW-001.md#c3--mandatory-registry-fields)
- [LAW-001 §B12 — Enforcement Mechanisms](../../../docs/registered/LAW-001.md#b12--enforcement-mechanisms)

---

_Created: 2026-01-01_
