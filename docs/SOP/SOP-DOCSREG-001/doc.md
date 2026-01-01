<!-- BEGIN: AIBOS_MANAGED -->
| Field | Value | |---|---| | **Document ID** |
SOP-DOCSREG-001
| | **Document Type** |
SOP
| | **Classification** |
STANDARD
| | **Title** |
Document Registry SDK Standard Operating Procedures
| | **Status** |
DRAFT
| | **Authority** |
DERIVED
| | **Derived From** |
`LAW-001`,
    `TSD-DOCSREG-001`
| | **Version** |
0.1.0
| | **Owners** |
`Poh Lai`
| | **Checksum (SHA-256)** |
`6065b9b44c8c24b0525762d97721a71c5ece6ee9cc5f44277c87661f7c5b422f`
| | **Updated** |
2026-01-01
|
<!-- END: AIBOS_MANAGED -->











# SOP-DOCSREG-001 — Document Registry SDK Standard Operating Procedures

## Abstract

This SOP defines the standard operating procedures for using `@aibos/docs-registry`. It covers workflows for document creation, generation, auditing, CI integration, and package publishing.

---

## SOP-001: Creating a New Document

### Purpose

Create a new governance document with proper structure.

### Procedure

1. **Determine document type and ID**

   | Type | Pattern         | Example         |
   | ---- | --------------- | --------------- |
   | RFC  | RFC-{SCOPE}-NNN | RFC-DOCSREG-001 |
   | PRD  | PRD-{SCOPE}-NNN | PRD-DOCSREG-001 |
   | SRS  | SRS-{SCOPE}-NNN | SRS-DOCSREG-001 |
   | ADR  | ADR-{SCOPE}-NNN | ADR-DOCSREG-001 |
   | TSD  | TSD-{SCOPE}-NNN | TSD-DOCSREG-001 |
   | SOP  | SOP-{SCOPE}-NNN | SOP-DOCSREG-001 |

2. **Create folder structure**

   ```bash
   mkdir -p docs/{TYPE}/{DOC-ID}
   ```

3. **Create doc.json**

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
     "supersedes": [],
     "version": "0.1.0",
     "owners": ["Your Name"],
     "checksum_sha256": null,
     "implemented": [],
     "approvals": [
       {
         "action": "CREATED",
         "by": "Your Name",
         "date": "2026-01-01",
         "note": "Initial creation"
       }
     ],
     "created_at": "2026-01-01",
     "updated_at": "2026-01-01"
   }
   ```

4. **Create doc.md**

   ```markdown
   <!-- BEGIN: AIBOS_MANAGED -->
   <!-- END: AIBOS_MANAGED -->

   # {DOC-ID} — {Title}

   ## Abstract

   (Your content here)
   ```

5. **Generate managed block**

   ```bash
   pnpm docs:gen
   ```

6. **Verify**

   ```bash
   pnpm docs:audit
   ```

### Exit Criteria

- [ ] doc.json validates against schema
- [ ] doc.md has managed block populated
- [ ] Checksum computed and stored
- [ ] INDEX.md updated

---

## SOP-002: Updating a Document

### Purpose

Update an existing document while maintaining integrity.

### Procedure

1. **Edit doc.md content** (outside managed block only)

2. **Update doc.json metadata** if needed:

   - Increment version (semver)
   - Update `updated_at`
   - Add approval record

3. **Regenerate**

   ```bash
   pnpm docs:gen
   ```

4. **Verify**

   ```bash
   pnpm docs:audit
   ```

5. **Commit**

   ```bash
   git add docs/
   git commit -m "docs({DOC-ID}): update to v{VERSION}"
   ```

### Version Increment Rules

| Change Type       | Version Bump | Example       |
| ----------------- | ------------ | ------------- |
| Fix typo          | Patch        | 1.0.0 → 1.0.1 |
| Add section       | Minor        | 1.0.0 → 1.1.0 |
| Major restructure | Major        | 1.0.0 → 2.0.0 |
| Status change     | Patch        | 1.0.0 → 1.0.1 |

---

## SOP-003: Running Audits

### Purpose

Verify document integrity before commit or in CI.

### Procedure

1. **Full audit**

   ```bash
   pnpm docs:audit
   ```

   This runs:

   - Schema validation
   - Checksum verification
   - Orphan detection

2. **Specific audits**

   ```bash
   # Checksum only
   pnpm docs:audit:checksum

   # INDEX consistency
   pnpm docs:audit:index

   # Orphan detection
   pnpm docs:audit:orphans
   ```

3. **Interpret results**

   | Exit Code | Meaning             |
   | --------- | ------------------- |
   | 0         | All checks passed   |
   | 1         | Violations detected |

4. **Fix violations**

   | Violation         | Fix                                     |
   | ----------------- | --------------------------------------- |
   | INVALID_SCHEMA    | Fix doc.json to match schema            |
   | CHECKSUM_MISMATCH | Run `pnpm docs:gen`                     |
   | PHANTOM_DOC       | Remove entry from INDEX.md (or run gen) |
   | MISSING_DOC       | Add doc to INDEX.md (or run gen)        |

---

## SOP-004: CI Integration

### Purpose

Enforce document governance in CI pipeline.

### Procedure

1. **Add to package.json**

   ```json
   {
     "scripts": {
       "docs:gen": "tsx scripts/gen-docs.ts",
       "docs:audit": "tsx scripts/audit-docs.ts"
     }
   }
   ```

2. **Create scripts/gen-docs.ts**

   ```typescript
   import { generateDocs, generateIndex } from "@aibos/docs-registry";

   async function main() {
     await generateDocs({ docsDir: "docs" });
     await generateIndex({ docsDir: "docs" });
     console.log("✅ Docs generated");
   }

   main().catch((e) => {
     console.error(e);
     process.exit(1);
   });
   ```

3. **Create scripts/audit-docs.ts**

   ```typescript
   import { auditAll } from "@aibos/docs-registry";

   async function main() {
     const result = await auditAll({ docsDir: "docs" });

     if (!result.passed) {
       console.error("❌ Audit failed:");
       for (const v of result.violations) {
         console.error(`  [${v.type}] ${v.docId}: ${v.message}`);
       }
       process.exit(1);
     }

     console.log("✅ Audit passed");
   }

   main().catch((e) => {
     console.error(e);
     process.exit(1);
   });
   ```

4. **Add to CI workflow** (GitHub Actions example)

   ```yaml
   - name: Audit Docs
     run: pnpm docs:audit
   ```

5. **Add to Turbo pipeline** (if using Turborepo)

   ```json
   {
     "pipeline": {
       "docs:audit": {
         "dependsOn": ["^build"],
         "outputs": []
       }
     }
   }
   ```

---

## SOP-005: Publishing the Package

### Purpose

Publish `@aibos/docs-registry` to npm.

### Pre-Publish Checklist

- [ ] All docs audited (`pnpm docs:audit`)
- [ ] All tests passing (`pnpm test`)
- [ ] Version bumped in package.json
- [ ] CHANGELOG updated
- [ ] README up to date

### Procedure

1. **Build**

   ```bash
   pnpm build
   ```

2. **Verify exports**

   ```bash
   pnpm pack --dry-run
   ```

3. **Publish (private first)**

   ```bash
   npm publish --access restricted
   ```

4. **Publish (public when ready)**

   ```bash
   npm publish --access public
   ```

### Version Strategy

| Phase       | Version | npm Access |
| ----------- | ------- | ---------- |
| Development | 0.x.y   | restricted |
| Beta        | 0.9.x   | restricted |
| Stable      | 1.0.0+  | public     |

---

## SOP-006: Creating Standard Packs

### Purpose

Define reusable document packs for new projects.

### Procedure

1. **Create pack definition**

   ```typescript
   // src/packs/my-pack-v1.ts
   import type { DocJson } from "../schema/doc.schema.js";

   export const MY_PACK_V1: DocJson[] = [
     {
       document_id: "RFC-MYPACK-001",
       document_type: "RFC",
       // ... all fields
     },
     // ... more docs
   ];
   ```

2. **Register pack**

   ```typescript
   // src/packs/index.ts
   import { MY_PACK_V1 } from "./my-pack-v1.js";

   export const PACKS = {
     "my-pack-v1": MY_PACK_V1,
   } as const;
   ```

3. **Use pack**

   ```typescript
   import { createStandardSet } from "@aibos/docs-registry";

   await createStandardSet({
     pack: "my-pack-v1",
     outputDir: "docs",
   });
   ```

---

## SOP-007: Document Authority Chain

### Purpose

Ensure documents follow proper authority hierarchy.

### Authority Hierarchy

```
LAW (Level 1 — Constitutional)
 ↓
PRD (Level 2 — Product Intent)
 ↓
SRS (Level 3 — System Requirements)
 ↓
ADR (Level 4 — Architecture Decisions)
 ↓
TSD (Level 5 — Technical Specification)
 ↓
SOP (Level 6 — Operating Procedures)
```

### Rules

1. **Derived From** must reference parent level

   - PRD derives from LAW
   - SRS derives from PRD
   - etc.

2. **Lower cannot override higher**

   - SRS cannot contradict PRD
   - ADR cannot contradict SRS

3. **RFC is special**
   - RFC is for proposals (pre-decision)
   - RFC derives from LAW but has no authority until promoted

### Promotion Path

```
RFC → (approved) → PRD → SRS → ADR → TSD → SOP
```

---

## Quick Reference

| Task                | Command                                    |
| ------------------- | ------------------------------------------ |
| Generate all docs   | `pnpm docs:gen`                            |
| Run full audit      | `pnpm docs:audit`                          |
| Check schema only   | Import `DocJsonSchema` and call `.parse()` |
| Create standard set | `createStandardSet({ pack, outputDir })`   |
| Publish package     | `npm publish`                              |

---

## References

- [TSD-DOCSREG-001](../TSD/TSD-DOCSREG-001/doc.md) — Technical Specification
- [ADR-DOCSREG-001](../ADR/ADR-DOCSREG-001/doc.md) — Architecture Decisions
- [LAW-001](../../../../docs/registered/LAW-001.md) — Constitution

---

_Created: 2026-01-01_
