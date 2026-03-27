---
description: PR review skill. Reviews all changed files in the current branch against project conventions and proposes interactive fixes. Use when the user asks to review a PR, review changes, or check code quality on a branch.
---

# PR Review

Reviews all changes in the current branch (compared to the target branch, default: `main`) against **every project rule** from:

- `AGENTS.md` — all sections (code conventions, Vue 3 standards, CSS formatting, import restrictions)
- `.agents/skills/file-conventions/SKILL.md` — all rules
- `.agents/skills/testing/SKILL.md` — all rules

The review follows a strict two-phase workflow: **full review first**, then **interactive point-by-point fixing**.

---

## Phase 1 — Full Review

### Step 1: Collect context

1. **Load Rules**: Read the following files and combine all rules found:
   - `AGENTS.md` (already available in conversation context via `CLAUDE.md`)
   - `.agents/skills/file-conventions/SKILL.md`
   - `.agents/skills/testing/SKILL.md`
2. **Identify Changes**: Run `git diff <base>...HEAD --name-only` where `<base>` is the target branch (default: `main`). If the user specifies a different target branch, use that instead. If the base branch does not exist locally, run `git fetch origin <base>` first and diff against `origin/<base>`.
3. **Smart Read**: For each changed file:
   - Skip deleted files (files that no longer exist on disk).
   - Skip binary files (images, fonts, PDFs, etc.).
   - Read the file content.
   - If the file is very large (>500 lines), focus primarily on the changed sections (hunks) and their surrounding context.

### Step 2: Check every rule

For each changed file, verify **all rules** from the three sources above. Only report violations on **changed lines** (additions and modifications in the diff). Do not flag pre-existing issues in unchanged code unless they are directly impacted by the changes (e.g., a renamed import that breaks a convention).

### Step 3: Present the review

Severity icons: 🔴 ERROR (must fix) · ⚠️ WARNING (should fix) · ℹ️ INFO (consider fixing)

```
## PR Review — [branch name]

X files changed · Y violations found

### Violations

| # | Sev | File | Line | Issue |
|---|-----|------|------|-------|
| 1 | 🔴 | `file.vue` | 12 | Short description |
| 2 | ⚠️ | `file.vue` | 45 | Short description |
| 3 | ℹ️ | `other.ts` | 8 | Short description |

### Details

**1. 🔴 `file.vue:12`** — Short description
What is wrong and why.
→ Fix: concise proposed solution

**2. ⚠️ `file.vue:45`** — Short description
What is wrong and why.
→ Fix: concise proposed solution

**3. ℹ️ `other.ts:8`** — Short description
What is wrong and why.
→ Fix: concise proposed solution
```

If no violations are found, confirm the PR is clean and skip Phase 2.

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

**C. Apply the fix** (if approved):
1. Apply the code change
2. Run `npx eslint --fix <modified-file>` to validate the fix immediately (only on the modified file, not the entire workspace).
   - If the changed file is not part of any workspace (root config, `.agents/`, etc.), skip validation for that fix.
3. If lint fails, report the error and propose a fix before moving on.

**D. Move to the next point.** Repeat until all violations are addressed or skipped.

**E. After all violations in a file are addressed**, run the full validation pipeline on affected files only:
   - `npm run build --workspace=@pulse/<workspace>`
   - Run only the related test file(s) (e.g., `npx vitest run <modified-file>.spec.ts --workspace=@pulse/<workspace>`) — do not run the full test suite.

### Bulk mode (on request only)

If the user explicitly asks for bulk mode:
1. Present all violations at once (using the review table from Phase 1)
2. Ask the user to approve/reject each violation by number
3. Apply all approved fixes
4. Run validation once at the end on all modified files

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
- **Point by point by default** — after the review summary, immediately present the first violation and its fix, ask for approval, then move to the next. Only switch to bulk mode if the user explicitly requests it
- If a fix introduces a new violation, flag it immediately
- When fixing Vue code, consult Context7 for up-to-date Vue 3 documentation
- **Write the review in French** — all descriptions, explanations, and fix proposals must be in French
- **Git only** — never use `gh`, GitHub CLI, or any GitHub API. This project uses Azure DevOps. Use only `git` commands to collect branch and diff information
