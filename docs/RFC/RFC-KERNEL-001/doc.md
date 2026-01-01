<!-- BEGIN: AIBOS_MANAGED -->
| Field | Value | |---|---| | **Document ID** |
RFC-KERNEL-001
| | **Document Type** |
RFC
| | **Classification** |
PROPOSAL
| | **Title** |
3-Tier Constitutional Model
| | **Status** |
DRAFT
| | **Authority** |
DERIVED
| | **Derived From** |
`LAW-001`
| | **Version** |
1.0.0
| | **Owners** |
`Poh Lai`
| | **Checksum (SHA-256)** |
`5d528b9c32619b40ad53dfbbbdac08c580a6a7aa3d850f75972ed6dc67b9bf5d`
| | **Updated** |
2026-01-01
|
<!-- END: AIBOS_MANAGED -->









# RFC-KERNEL-001 — Constitutional Law of Continuity, Memory, and Meaning

---

## Abstract

This RFC establishes the **3-Tier Constitutional Model** for the NexusCanon system.

It defines:

- **Tier 1:** Constitutional Laws (Human Truths) — foundational philosophy
- **Tier 2:** Enforcement Doctrines (Non-Optional Mechanics) — required mechanisms
- **Tier 3:** Enforcement Surface (Execution Reality) — mandatory capabilities

**Design Principles:**

- No hard-coded numbering assumptions
- Structure is stable for humans, evolvable for machines
- Registry assigns IDs, order, versions via `@aibos/docs-registry`
- Clean separation of philosophy vs enforcement

---

## Preamble — Why This Law Exists

Enterprise systems do not fail because they lack features.
They fail because they **forget why decisions were made**.

This Law exists to ensure that:

- Business **never stops**
- Meaning **never drifts**
- Deviations **never disappear**
- Governance is **memory, not obstruction**

> This Law governs _how truth survives time_.

---

# TIER 1 — CONSTITUTIONAL LAWS

## Human Truths

These are **foundational truths**.
They define culture, philosophy, and intent.
They are **human-memorable** and **rarely change**.

---

### Law: Business Continuity Is Sacred

The system must never prevent the business from continuing.

- Any step may be skipped
- Any rule may be overridden
- Any approval may be force-applied

Blocking reality causes users to leave the system.
Leaving the system destroys governance.

> **Continuity is non-negotiable.**

---

### Law: Deviation Is First-Class Data

Deviation is not an error.
Deviation is information.

Every deviation must:

- exist as data
- be named
- be queryable
- be visible later

> A system that hides deviation is **lying to the future**.

---

### Law: Defaults Define Safety, Overrides Define Intent

Defaults describe what is normally safe.
Overrides describe what was intentionally chosen.

- Safety without override is rigidity
- Override without memory is chaos

> Both must coexist.

---

### Law: Governance Is Memory, Not Control

The system does not judge.
The system remembers.

Governance means:

- knowing what happened
- knowing why
- knowing who decided

> Governance is never permission walls or silent denial.

---

### Law: If It Is Allowed, It Must Be Remembered

Any action the system permits must be recorded.

If the system allows it, the system owns the memory of it.

> There are no silent paths.

---

### Law: Forensic Discipline Over Cleverness

All observable behavior must be explainable.

Actions must resolve into traceable, reversible operations.
There are no "magic buttons."

> Clarity is governance.

---

### Law: There Are No Custom Truths

There is one canonical truth.
There may be many local languages.

Customization may rename, but never redefine.

> Truth is shared; language is local.

---

### Law: Language Must Preserve Dignity

The system never says "cannot."
The system says "this will be recorded."

Language must:

- preserve human dignity
- preserve continuity
- preserve traceability

> Tone is part of governance.

---

### Law: Meaning Must Survive Interface Change

Interfaces change.
Frameworks change.
Brands change.

Meaning must not.

> Governance cannot depend on UI shape.

---

### Law: The System Remembers, It Never Judges

Judgment belongs to humans, auditors, regulators, and time.

The system's role is:

- faithful memory
- accurate lineage
- neutral reporting

> Nothing more. Nothing less.

---

# TIER 2 — ENFORCEMENT DOCTRINES

## Non-Optional Mechanics

These doctrines **are not philosophy**.
They are **required mechanisms** to make Tier-1 laws real.

They are **mandatory** but **evolvable**.

---

### Doctrine: Registry Is the Sole Semantic Authority

Meaning comes from `@aibos/docs-registry` — nowhere else.

Not from:

- UI labels
- database columns
- code variables
- API payloads

> All meaning must resolve to registered concepts.

---

### Doctrine: Semantic Immutability

Meaning, once defined, never changes.

If meaning changes:

- a new concept is created
- the old one is deprecated
- lineage is explicit

> Behavior is meaning. Changing behavior without new meaning is forbidden.

---

### Doctrine: No Minor Edits

There is no such thing as a "minor semantic edit."

- Meaning change → new version
- Typo → errata, not rewrite
- Originals are sacred

> History is append-only.

---

### Doctrine: Override Requires Explicit Contract

Every override must create an explicit record containing:

| Field          | Description         |
| -------------- | ------------------- |
| **What**       | What was overridden |
| **Why**        | Reason (mandatory)  |
| **Who**        | Who approved it     |
| **When**       | When it applies     |
| **Risk**       | Risk introduced     |
| **Downstream** | Downstream impact   |

> Override without memory is prohibited.

---

### Doctrine: Override Lineage Must Propagate

Overrides are not local accidents.

Downstream effects must be:

- identified
- recorded
- traceable across reports, ledgers, and outputs

> There is no "contained override" without evidence.

---

### Doctrine: AI Is a Governed Participant

AI may:

- read
- analyze
- suggest
- simulate

AI may not:

- approve
- supersede
- commit truth
- redefine meaning

> AI outputs are proposals, never authority.

---

### Doctrine: Ownership Is Role-Based

Truth cannot belong to individuals.

Ownership must be:

- role-based
- institutional
- auditable

> People leave. Roles persist.

---

### Doctrine: Determinism Is Required

Given the same inputs, the system must produce the same outputs.

This applies especially to:

- schema generation
- code generation
- registry resolution

> Non-determinism destroys auditability.

---

# TIER 3 — ENFORCEMENT SURFACE

## Execution Reality

These are **required capabilities**, not design suggestions.

Implementation may vary.
Existence is mandatory.

---

### Required System Capabilities

The platform must provide mechanisms equivalent to:

| Capability                    | Purpose                           |
| ----------------------------- | --------------------------------- |
| Semantic registry validation  | Ensure all terms are registered   |
| Alias resolution              | Map local language to canonical   |
| Override creation & querying  | Create and retrieve override data |
| Audit timeline reconstruction | Rebuild history at any point      |
| Semantic version diffing      | Compare meaning across versions   |
| AI proposal logging           | Track AI suggestions separately   |

---

### Required Enforcement Gates

The system must be capable of preventing:

| Violation             | Gate Behavior           |
| --------------------- | ----------------------- |
| Unregistered meaning  | Block + alert           |
| Silent overrides      | Require explicit record |
| Semantic mutation     | Require new version     |
| AI committing truth   | Block + log attempt     |
| Non-traceable actions | Reject at entry point   |

> Governance must fail **early and loudly**.

---

# FUTURE-YOU WARNING

One day someone will say:

- "Let's simplify this"
- "Users find this annoying"
- "We can hide this step"
- "This is too strict"

If that change weakens:

- memory
- lineage
- meaning
- traceability

Then this Law has been violated.

> **This document exists to protect you from that moment.**

---

# FINAL AUTHORITY STATEMENT

This Law supersedes:

- convenience
- speed
- pressure
- shortcuts

Any system that violates this Law is **not compliant**, regardless of intent.

---

# SUMMARY

| Property                        | Status |
| ------------------------------- | ------ |
| Clean philosophy vs enforcement | ✅     |
| No artificial numbering         | ✅     |
| Registry-based evolution        | ✅     |
| AI-safe governance              | ✅     |
| Audit-grade durability          | ✅     |
| Zero drift over time            | ✅     |

---

**End of RFC-001**
