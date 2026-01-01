<!-- BEGIN: AIBOS_MANAGED -->
| Field | Value | |---|---| | **Document ID** |
ADR-DOCSREG-001
| | **Document Type** |
ADR
| | **Classification** |
STANDARD
| | **Title** |
Document Registry SDK Architecture Decision Record
| | **Status** |
DRAFT
| | **Authority** |
DERIVED
| | **Derived From** |
`LAW-001`,
    `SRS-DOCSREG-001`
| | **Version** |
0.1.0
| | **Owners** |
`Poh Lai`
| | **Checksum (SHA-256)** |
`14c05ded20fcc33958392537ba37ea3e28d0ad4aa4c89ae866f8bf26a8033d83`
| | **Updated** |
2026-01-01
|
<!-- END: AIBOS_MANAGED -->











# ADR-DOCSREG-001 — Document Registry SDK Architecture Decision Record

## Abstract

This ADR documents the key architectural decisions for `@aibos/docs-registry`. Each decision includes context, options considered, decision made, and consequences.

---

## ADR-001: NPM-Pure Library (No CLI)

### Context

The SDK needs to be usable across multiple repositories. Two patterns were considered:

1. CLI tool with commands
2. NPM-pure library with functions

### Options

| Option          | Pros                                             | Cons                                                 |
| --------------- | ------------------------------------------------ | ---------------------------------------------------- |
| **CLI Tool**    | Easy to run from terminal, discoverable commands | Harder to compose, less flexible, extra dependencies |
| **NPM Library** | Composable, testable, zero magic, CI-friendly    | Requires wrapper scripts                             |

### Decision

**NPM-pure library pattern.**

All functionality is exposed as functions:

- `generateDocs(config)`
- `auditAll(config)`
- `createStandardSet(options)`

Consumers write their own scripts or package.json commands.

### Consequences

- ✅ Maximum flexibility for consumers
- ✅ Easy to test in isolation
- ✅ Works in any build system (Turbo, Nx, Lerna)
- ⚠️ Consumers must write wrapper scripts (trivial)

**Traces To:** RFC-DOCSREG-001 §Core Principle

---

## ADR-002: Zod for Schema Validation

### Context

Document metadata (doc.json) requires strict validation. Options:

1. JSON Schema (ajv)
2. Zod
3. io-ts
4. Manual validation

### Options

| Option          | Pros                                 | Cons                       |
| --------------- | ------------------------------------ | -------------------------- |
| **JSON Schema** | Standard, language-agnostic          | Verbose, no type inference |
| **Zod**         | Type inference, composable, great DX | TypeScript-only            |
| **io-ts**       | Functional, type-safe                | Steep learning curve       |
| **Manual**      | No dependencies                      | Error-prone, no types      |

### Decision

**Zod.**

Rationale:

- Already used in `@aibos/kernel`
- Type inference eliminates duplicate definitions
- Excellent error messages
- Small bundle size

### Consequences

- ✅ Single source of truth for types and validation
- ✅ Consistent with kernel package
- ✅ Rich error messages for debugging
- ⚠️ Requires TypeScript (acceptable for AIBOS ecosystem)

**Traces To:** SRS-DOCSREG-001 §1.1

---

## ADR-003: Folder-Based Document Unit

### Context

Documents need a storage structure. Options:

1. Single file per document (`DOC-ID.md`)
2. Folder per document with separate files (`DOC-ID/doc.json + doc.md`)
3. Frontmatter in Markdown

### Options

| Option           | Pros                         | Cons                              |
| ---------------- | ---------------------------- | --------------------------------- |
| **Single File**  | Simple                       | No separation of machine/human    |
| **Folder-Based** | Clear separation, extensible | More files                        |
| **Frontmatter**  | Common pattern               | Mixing concerns, hard to validate |

### Decision

**Folder-based document unit.**

```
docs/<TYPE>/<DOC-ID>/
  doc.json   ← machine-validated metadata
  doc.md     ← human-authored content + managed block
```

### Consequences

- ✅ Clean separation of machine and human content
- ✅ Easy to add assets (diagrams, attachments) later
- ✅ Each doc is self-contained
- ⚠️ More directories to navigate (acceptable trade-off)

**Traces To:** RFC-DOCSREG-001 §Storage Model

---

## ADR-004: Managed Block Pattern

### Context

doc.md needs to display metadata without manual sync. Options:

1. Separate header file included via reference
2. Inline managed block with markers
3. Full template regeneration

### Options

| Option                | Pros                    | Cons                     |
| --------------------- | ----------------------- | ------------------------ |
| **Include Reference** | Clean separation        | Requires tooling support |
| **Managed Block**     | Works with any Markdown | Markers in content       |
| **Full Regeneration** | Simple                  | Destroys human content   |

### Decision

**Managed block with markers.**

```markdown
<!-- BEGIN: AIBOS_MANAGED -->

(generated content)

<!-- END: AIBOS_MANAGED -->
```

Only content between markers is regenerated. Everything else is human-owned.

### Consequences

- ✅ Human content is never destroyed
- ✅ Works with any Markdown renderer
- ✅ No special tooling required to view
- ⚠️ Authors must not edit between markers (documented)

**Traces To:** SRS-DOCSREG-001 §2.2

---

## ADR-005: Handlebars for Templates

### Context

Templates need a rendering engine. Options:

1. Handlebars
2. EJS
3. Template literals
4. Mustache

### Options

| Option                | Pros                          | Cons                          |
| --------------------- | ----------------------------- | ----------------------------- |
| **Handlebars**        | Logic-less, safe, widely used | Extra dependency              |
| **EJS**               | Full JavaScript               | Security risk, too powerful   |
| **Template Literals** | No dependency                 | Hard to maintain              |
| **Mustache**          | Logic-less                    | Less features than Handlebars |

### Decision

**Handlebars (optional peer dependency).**

Rationale:

- Logic-less prevents template complexity
- Well-known syntax
- Optional dependency — consumers can skip if only using audits

### Consequences

- ✅ Safe, predictable template rendering
- ✅ Easy to write custom templates
- ✅ Optional dependency keeps core light
- ⚠️ Consumers using `generateDocs()` must install Handlebars

**Traces To:** PRD-DOCSREG-001 FR10

---

## ADR-006: Checksum on Normalized Content

### Context

Checksums must be stable across platforms. Problem: Windows uses CRLF, Unix uses LF.

### Options

| Option                    | Pros                  | Cons                     |
| ------------------------- | --------------------- | ------------------------ |
| **Raw file bytes**        | Simple                | Checksums differ by OS   |
| **Normalize before hash** | Stable cross-platform | Slightly more processing |

### Decision

**Normalize before hashing.**

Algorithm:

1. Read as UTF-8
2. Replace CRLF → LF
3. Trim trailing whitespace per line
4. Trim trailing newlines
5. Hash with SHA-256

### Consequences

- ✅ Same checksum on Windows and Unix
- ✅ Whitespace changes don't affect checksum
- ⚠️ Checksum is not of raw bytes (documented)

**Traces To:** SRS-DOCSREG-001 §3.1

---

## ADR-007: Fail-Fast on Schema Errors

### Context

When processing multiple documents, how to handle validation errors?

### Options

| Option                 | Pros                 | Cons                    |
| ---------------------- | -------------------- | ----------------------- |
| **Fail-fast**          | No partial state     | Stops on first error    |
| **Collect all errors** | See all problems     | May leave partial state |
| **Skip invalid**       | Continues processing | Silent failures         |

### Decision

**Fail-fast.**

If any doc.json fails validation, throw before modifying any files.

### Consequences

- ✅ No partial/corrupted state
- ✅ Clear error message
- ⚠️ Must fix first error before seeing others (acceptable)

**Traces To:** SRS-DOCSREG-001 §4.3

---

## ADR-008: Audit Functions Return Results (No Throws)

### Context

Audit functions detect violations. Should they throw or return?

### Options

| Option                 | Pros             | Cons                           |
| ---------------------- | ---------------- | ------------------------------ |
| **Throw on violation** | Familiar pattern | Hard to collect all violations |
| **Return results**     | Full visibility  | Caller must check              |

### Decision

**Return structured results.**

```typescript
interface AuditResult {
  passed: boolean;
  violations: Violation[];
}
```

Caller decides whether to throw, log, or continue.

### Consequences

- ✅ All violations visible in one call
- ✅ CI can format output as needed
- ✅ Programmatic handling easy
- ⚠️ Caller must check `passed` flag

**Traces To:** SRS-DOCSREG-001 §5.3

---

## ADR-009: INDEX.md is Generated-Only

### Context

INDEX.md lists all documents. Should manual edits be allowed?

### Decision

**Generated-only. No manual edits.**

`auditIndex()` fails if INDEX.md differs from regenerated output.

### Consequences

- ✅ Zero drift between INDEX and filesystem
- ✅ Single source of truth
- ⚠️ Custom notes in INDEX not allowed (use a separate file)

**Traces To:** RFC-DOCSREG-001 §5

---

## ADR-010: Standard Packs for Bulk Scaffolding

### Context

New projects need many governance documents. Creating them manually is tedious.

### Decision

**Ship standard packs.**

A "pack" is a predefined set of document templates:

```typescript
createStandardSet({
  pack: "kernel-governance-v1",
  outputDir: "docs",
});
```

This generates all standard docs with placeholders, computes checksums, and creates INDEX.

### Consequences

- ✅ Instant governance setup for new projects
- ✅ Consistent structure across repos
- ✅ Easy to add new packs
- ⚠️ Pack definitions must be maintained

**Traces To:** RFC-DOCSREG-001 §7

---

## Decision Log

| #       | Decision                   | Date       | Status      |
| ------- | -------------------------- | ---------- | ----------- |
| ADR-001 | NPM-pure library           | 2026-01-01 | ✅ APPROVED |
| ADR-002 | Zod for schemas            | 2026-01-01 | ✅ APPROVED |
| ADR-003 | Folder-based document unit | 2026-01-01 | ✅ APPROVED |
| ADR-004 | Managed block pattern      | 2026-01-01 | ✅ APPROVED |
| ADR-005 | Handlebars templates       | 2026-01-01 | ✅ APPROVED |
| ADR-006 | Normalized checksum        | 2026-01-01 | ✅ APPROVED |
| ADR-007 | Fail-fast on schema errors | 2026-01-01 | ✅ APPROVED |
| ADR-008 | Audit returns results      | 2026-01-01 | ✅ APPROVED |
| ADR-009 | INDEX.md generated-only    | 2026-01-01 | ✅ APPROVED |
| ADR-010 | Standard packs             | 2026-01-01 | ✅ APPROVED |

---

## References

- [SRS-DOCSREG-001](../SRS/SRS-DOCSREG-001/doc.md) — System Requirements
- [PRD-DOCSREG-001](../PRD/PRD-DOCSREG-001/doc.md) — Product Requirements
- [RFC-DOCSREG-001](../RFC/RFC-DOCSREG-001/doc.md) — Original Proposal

---

_Created: 2026-01-01_
