<!-- BEGIN: AIBOS_MANAGED -->
| Field | Value | |---|---| | **Document ID** |
PRD-DOCSREG-001
| | **Document Type** |
PRD
| | **Classification** |
STANDARD
| | **Title** |
Document Registry SDK Product Requirements
| | **Status** |
DRAFT
| | **Authority** |
DERIVED
| | **Derived From** |
`LAW-001`,
    `RFC-DOCSREG-001`
| | **Version** |
0.1.0
| | **Owners** |
`Poh Lai`
| | **Checksum (SHA-256)** |
`b6ea9b9113e74a882907c487a74e50265515eca814bf2f6ebd0e353ffd24b3de`
| | **Updated** |
2026-01-01
|
<!-- END: AIBOS_MANAGED -->











# PRD-DOCSREG-001 — Document Registry SDK Product Requirements

## Abstract

This PRD defines the product requirements for `@aibos/docs-registry`, an NPM-pure governance SDK. It establishes scope, goals, non-goals, and success criteria that derive from RFC-DOCSREG-001 and LAW-001.

---

## Problem

### Business Context

AIBOS governance requires machine-enforceable document management:

1. **LAW-001 §C3** mandates registry fields for all governance documents
2. **LAW-001 §B12** requires enforcement mechanisms
3. **LAW-001 §A6** states "Governance is Memory" — every decision must be recorded

### Current Gap

- Documents are free-form with no validated structure
- INDEX.md drifts from filesystem reality
- No checksum verification for content integrity
- Governance tooling is repo-specific, not reusable

### Impact

- Cannot machine-verify LAW-001 compliance
- Cannot detect phantom or missing documents
- Onboarding new projects requires re-implementing governance

---

## Goals

| #   | Goal                           | Success Metric                                |
| --- | ------------------------------ | --------------------------------------------- |
| G1  | **Validate document metadata** | 100% of doc.json files pass schema validation |
| G2  | **Ensure INDEX accuracy**      | Zero phantom docs, zero missing docs          |
| G3  | **Enforce content integrity**  | All checksums verified in CI                  |
| G4  | **Enable bulk scaffolding**    | Generate 50+ docs in <10 seconds              |
| G5  | **Portable across repos**      | Works in any repo with `npm install`          |

---

## Non-Goals

| #   | Non-Goal                  | Reason                                            |
| --- | ------------------------- | ------------------------------------------------- |
| NG1 | CLI tool                  | SDK pattern is more flexible                      |
| NG2 | Migration utilities       | Each repo owns its migration                      |
| NG3 | Kernel doctrine ownership | Kernel package owns LAW-001                       |
| NG4 | UI/dashboard              | SDK is headless                                   |
| NG5 | Database sync             | Local files are SSOT; DB sync is separate concern |

---

## Scope

### In Scope

| Feature              | Description                                 |
| -------------------- | ------------------------------------------- |
| **Zod Schemas**      | `DocJsonSchema` and related types           |
| **Generation**       | Managed header blocks, checksum computation |
| **INDEX Generation** | Deterministic scanning and output           |
| **Audits**           | Schema, checksum, orphan, phantom detection |
| **Standard Packs**   | Pre-defined document sets for scaffolding   |
| **TypeScript Types** | Full type exports for consumers             |

### Out of Scope

| Feature               | Reason                             |
| --------------------- | ---------------------------------- |
| Markdown parsing      | Use existing libraries             |
| Git integration       | Consumer responsibility            |
| CI/CD integration     | Consumer configures their pipeline |
| Template authoring UI | Manual template creation           |

---

## User Stories

### US1: Validate Document Metadata

> As a **developer**, I want to validate my doc.json files against a schema, so that I catch errors before commit.

**Acceptance:**

- Import `DocJsonSchema` from package
- Call `.parse()` or `.safeParse()` on JSON
- Get typed result or detailed error messages

### US2: Generate Managed Headers

> As a **document author**, I want the SDK to generate header tables from doc.json, so that my doc.md stays in sync with metadata.

**Acceptance:**

- Call `generateDocs({ docsDir: "docs" })`
- All doc.md files have updated `<!-- BEGIN/END: AIBOS_MANAGED -->` blocks
- Checksums are computed and written to doc.json

### US3: Generate INDEX

> As a **governance officer**, I want the SDK to generate INDEX.md from all doc.json files, so that I have a single source of truth for document inventory.

**Acceptance:**

- Call `generateIndex({ docsDir: "docs" })`
- INDEX.md is deterministic (same input → same output)
- All docs in filesystem appear in INDEX
- All entries in INDEX exist in filesystem

### US4: Audit for Drift

> As a **CI pipeline**, I want to detect document drift, so that I fail builds when governance is violated.

**Acceptance:**

- Call `auditAll({ docsDir: "docs" })`
- Returns structured result: `{ passed: boolean, violations: Violation[] }`
- Detects: invalid schema, wrong checksum, phantom docs, missing docs

### US5: Scaffold Standard Documents

> As a **new project lead**, I want to scaffold standard governance documents, so that I don't start from scratch.

**Acceptance:**

- Call `createStandardSet({ pack: "kernel-governance-v1", outputDir: "docs" })`
- Creates folder structure with doc.json + doc.md for each document
- Generates INDEX.md

---

## Requirements

### Functional Requirements

| ID   | Requirement                                      | Priority | Traces To       |
| ---- | ------------------------------------------------ | -------- | --------------- |
| FR1  | SDK SHALL export `DocJsonSchema` Zod schema      | P0       | G1, US1         |
| FR2  | SDK SHALL export `generateDocs()` function       | P0       | G2, US2         |
| FR3  | SDK SHALL export `generateIndex()` function      | P0       | G2, US3         |
| FR4  | SDK SHALL export `auditAll()` function           | P0       | G3, US4         |
| FR5  | SDK SHALL export `createStandardSet()` function  | P1       | G4, US5         |
| FR6  | SDK SHALL compute SHA-256 checksums              | P0       | G3, LAW-001.C03 |
| FR7  | SDK SHALL detect phantom documents (INDEX → FS)  | P0       | G2, LAW-001.C05 |
| FR8  | SDK SHALL detect missing documents (FS → INDEX)  | P0       | G2, LAW-001.C05 |
| FR9  | SDK SHALL normalize line endings before checksum | P0       | G3              |
| FR10 | SDK SHALL support custom templates directory     | P1       | G5              |

### Non-Functional Requirements

| ID   | Requirement                                         | Priority | Traces To |
| ---- | --------------------------------------------------- | -------- | --------- |
| NFR1 | SDK SHALL have zero runtime dependencies except Zod | P0       | G5        |
| NFR2 | SDK SHALL be ES module compatible                   | P0       | G5        |
| NFR3 | SDK SHALL export TypeScript declarations            | P0       | G5        |
| NFR4 | SDK SHALL process 100 docs in <5 seconds            | P1       | G4        |
| NFR5 | SDK SHALL work in Node.js 18+                       | P0       | G5        |

---

## Success Criteria

| #   | Criterion                                         | Measurement                                 |
| --- | ------------------------------------------------- | ------------------------------------------- |
| SC1 | All doc.json files in AIBOS repos pass validation | `auditAll()` returns `passed: true`         |
| SC2 | INDEX.md matches filesystem exactly               | Zero violations in audit                    |
| SC3 | Package publishes to npm                          | `npm install @aibos/docs-registry` succeeds |
| SC4 | Full TypeScript support                           | No `@ts-ignore` needed by consumers         |
| SC5 | Documentation complete                            | README.md with examples                     |

---

## Risks

| Risk                               | Likelihood | Impact | Mitigation                                   |
| ---------------------------------- | ---------- | ------ | -------------------------------------------- |
| Schema changes break existing docs | Medium     | High   | Version schema, provide migrations           |
| Template system too rigid          | Low        | Medium | Allow custom templates directory             |
| Checksum algorithm incompatibility | Low        | High   | Use standard SHA-256, document normalization |

---

## References

- [RFC-DOCSREG-001](../RFC/RFC-DOCSREG-001/doc.md) — Original proposal
- [LAW-001 — Constitution](../../../../docs/registered/LAW-001.md)
- [LAW-001 §C3](../../../../docs/registered/LAW-001.md#c3--mandatory-registry-fields) — Mandatory Registry Fields
- [LAW-001 §C5](../../../../docs/registered/LAW-001.md#c5--anti-orphan-rules) — Anti-Orphan Rules

---

_Created: 2026-01-01_
