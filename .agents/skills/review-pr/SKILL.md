---
name: review-pr
description: PR review skill. Reviews all changed files in the current branch against project conventions AND analyzes the functional logic and flows, then proposes interactive fixes. Use when the user asks to review a PR, review changes, or check code quality/logic on a branch.
---

# PR Review

Reviews all changes in the current branch (compared to the target branch, default: `main`) against **every project rule** from:

- `AGENTS.md` — all sections (code conventions, Vue 3 standards, CSS formatting, import restrictions)
- `.agents/skills/file-conventions/SKILL.md` — all rules
- `.agents/skills/testing/SKILL.md` — all rules
- `.agents/skills/npm-install/SKILL.md` — only if the diff touches `package.json` or `package-lock.json`

Beyond conventions, the review also analyzes the **functional logic and the flows** the changes participate in — correctness, edge cases, data flow, async and user/navigation flows, and regression risk.

The review follows a strict two-phase workflow: **full review first**, then **interactive point-by-point fixing**.

---

## Phase 1 — Full Review

### Step 1: Collect context

1. **Load Rules**: Read the following files and combine all rules found:
   - `AGENTS.md` (already available in conversation context via `CLAUDE.md`)
   - `.agents/skills/file-conventions/SKILL.md`
   - `.agents/skills/testing/SKILL.md`
   - `.agents/skills/npm-install/SKILL.md` — only if the diff touches `package.json` or `package-lock.json` (check the added dependencies against its gates: popularity, recency, deprecation, license)
2. **Identify Changes**: Run `git diff <base>...HEAD --name-only` where `<base>` is the target branch (default: `main`). If the user specifies a different target branch, use that instead. If the base branch does not exist locally, run `git fetch origin <base>` first and diff against `origin/<base>`.
3. **Capture Intent**: Run `git log <base>..HEAD --oneline` and read the branch name to reconstruct **what the PR is supposed to do**. This intent is the reference used in Step 2b to verify the logic actually delivers it.
4. **Smart Read**: For each changed file:
   - Skip deleted files (files that no longer exist on disk).
   - Skip binary files (images, fonts, PDFs, etc.).
   - Read the file content.
   - If the file is very large (>500 lines), focus primarily on the changed sections (hunks) and their surrounding context.

### Step 2: Review the changes

The review has **two complementary dimensions**. Run both for every changed file.

#### 2a — Conventions

For each changed file, verify **all rules** from the sources above. Only report violations on **changed lines** (additions and modifications in the diff). Do not flag pre-existing issues in unchanged code unless they are directly impacted by the changes (e.g., a renamed import that breaks a convention).

**File-level obligations** are exempt from the changed-lines scoping: for each changed `.manager.ts`, `.composable.ts`, or `.validation.ts`, verify that the sibling `.spec.ts` exists and was updated if the behavior changed. A missing mandatory spec is a 🔴 finding even though no specific line is at fault.

#### 2b — Logic & flows

Beyond style, analyze whether the code is **functionally correct** and whether the **flows it participates in still hold**. Confront the changes against the PR intent captured in Step 1. For each meaningful change, examine:

- **Correctness** — does the code do what the PR intends? Look for inverted conditions, off-by-one, wrong operator, mismatched units, incorrect default/initial values.
- **Edge cases** — empty/null/undefined, empty arrays, `0`, boundary values, error responses. Are nullish checks present everywhere data can be missing?
- **Data flow** — follow the data through the change: props in → emits/events out → Pinia store reads/writes → API request/response shapes. Does each hop pass and transform the data coherently? Are `computed` and `watch` kept in sync with their sources?
- **Async & loading flows** — are `await`s correct, are loading/error states handled, are there race conditions or unhandled promise rejections?
- **User & navigation flows** — routing guards (auth, permissions, feature flags), redirects, modal open/close lifecycle, form submission paths. Verify both the **happy path** AND the **failure path**.
- **Regression risk** — when the change touches a shared function, store, or component, trace its **callers** (read the relevant unchanged files) to confirm nothing downstream breaks.
- **Intent gap** — anything the PR claims to do (per its commits/branch) but does not, or does only partially.
- **i18n** — every translation key added or renamed must exist in BOTH locale files (`fr-FR.json` and `en-US.json`) of the applet. Flag hardcoded user-facing strings in templates.
- **Security** — flag `v-html` on non-sanitized data, secrets/tokens/URLs that should be environment variables, and sensitive data written to logs.
- **Stories** — if a component with a `.stories.ts` file changed its props/behavior, check the story still reflects it.

Report logic/flow findings with the same severity scale (Step 3). When the correct behavior is **ambiguous**, raise a **question for the author** instead of inventing a fix you are unsure about.

### Step 3: Present the review

Severity icons: 🔴 ERROR (must fix) · ⚠️ WARNING (should fix) · ℹ️ INFO (consider fixing)
Type: `Conv` (convention) · `Logic` (logic/flow).

Classification criteria:
- 🔴 ERROR: breaks a flow or behavior (logic bug, broken edge case, regression), or violates an absolute rule (falsy/truthy checks, defineModel, import restrictions, missing mandatory test)
- ⚠️ WARNING: convention divergence without functional impact, or a plausible but unproven logic risk
- ℹ️ INFO: improvement opportunity (simplification, naming, reuse of an existing helper)

```
## PR Review — [branch name]

X files changed · Y findings found (C conventions · L logic/flows)

### Findings

| # | Sev | Type | File | Line | Issue |
|---|-----|------|------|------|-------|
| 1 | 🔴 | Logic | `file.vue` | 12 | Short description |
| 2 | 🔴 | Conv | `file.vue` | 20 | Short description |
| 3 | ⚠️ | Logic | `file.ts` | 45 | Short description |
| 4 | ℹ️ | Conv | `other.ts` | 8 | Short description |

### Details

**1. 🔴 Logic `file.vue:12`** — Short description
What is wrong and why (for logic: which flow/case breaks).
→ Fix: concise proposed solution — or, if behavior is ambiguous, a **question for the author**.

**2. 🔴 Conv `file.vue:20`** — Short description
What is wrong and why.
→ Fix: concise proposed solution
```

If no findings are found, confirm the PR is clean and skip Phase 2.

---

## Phase 2 — Interactive Point-by-Point Fixing

After presenting the full review, immediately proceed to the first violation: present it with its proposed fix and ask for approval. Continue with the next violation after each response.

Then for **each violation**, in order of severity (ERRORS first, then WARNINGS, then INFO):

### For each point:

**A. Present** — Show:
- Violation number and total (e.g., "**Point 1/7**")
- File and line(s) concerned
- Current code snippet
- Problem explained clearly
- Proposed fix (one or more solutions if applicable)

**B. Ask for approval:**
> **Fix this? (yes / no / skip all [severity])**

- **yes** → apply the fix
- **no** → skip, move to the next
- **skip all [severity]** → skip all remaining points of that severity level

For an **ambiguous logic/flow finding** with no certain fix, present it as a **question for the author** rather than a code change: on **yes**, record it in the final summary instead of editing the file.

**C. Apply the fix** (if approved):
1. Apply the code change
2. Run `npx eslint --fix <modified-file>` to validate the fix immediately (only on the modified file, not the entire workspace).
   - If the changed file is not part of any workspace (root config, `.agents/`, etc.), skip validation for that fix.
3. If lint fails, report the error and propose a fix before moving on.

**D. Move to the next point.** Repeat until all violations are addressed or skipped.

**E. After all violations in a file are addressed**, run the full validation pipeline on affected files only:
   - `npm run build --workspace=@pulse/<workspace>` — skip if the workspace has no `build` script (e.g. `@pulse/e2e-mocks`)
   - Run only the related test file(s) (e.g., `npm run test --workspace=@pulse/<workspace> -- <modified-file>.spec.ts`) — do not run the full test suite.

### Bulk mode (on request only)

If the user explicitly asks for bulk mode:
1. Present all violations at once (using the review table from Phase 1)
2. Ask the user to approve/reject each violation by number
3. Apply all approved fixes
4. Run validation once at the end on all modified files

### Final validation

Before writing the Fix Summary, run lint + build + related tests once per affected workspace (same commands as Step E). "All checks passing" in the summary must reflect this actual run, not an assumption.

### Final summary

```
## Fix Summary
- X/Y violations fixed
- Z skipped
- All checks passing: yes/no
```

---

## Rules

- **Never auto-fix without asking** — always wait for user approval on each point
- **Scope all commands to affected workspaces** — never run lint/build/test on the entire monorepo
- **Read the full file before editing** — understand context before proposing changes
- **Review logic & flows, not just conventions** — confront the changes against the PR intent (Step 1), trace data and user flows, and check edge cases. When unsure about expected behavior, ask the author instead of guessing a fix
- **Point by point by default** — after the review summary, immediately present the first violation and its fix, ask for approval, then move to the next. Only switch to bulk mode if the user explicitly requests it
- If a fix introduces a new violation, flag it immediately
- When fixing Vue code, consult Context7 for up-to-date Vue 3 documentation
- **Match the user's language** (per AGENTS.md) — in practice the team works in French, so reviews are almost always in French
- **Git only** — never use `gh`, GitHub CLI, or any GitHub API. This project uses Azure DevOps. Use only `git` commands to collect branch and diff information
