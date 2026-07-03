---
name: run-app
description: How to run the Pulse.Web apps, Storybook, tests and lint locally. Use when you need to launch a dev server, verify a change in the running app, take a screenshot, run Storybook, or find the right command for a workspace.
---

# Running the App

## Dev servers

Run from the repo root:

```bash
npm run customer:dev       # customer app (Gigya auth), served at /
npm run collaborator:dev   # collaborator app (MSAL SSO), served at /collaborateur/
npm run backoffice:dev     # backoffice app
```

Per-app variants:

```bash
npm run dev:mocks --workspace=@pulse/customer   # dev server with MSW dev mocks (VITE_DEV_MOCKS=true) — no real backend needed
npm run dev:e2e --workspace=@pulse/customer     # E2E mode on port 1337 (VITE_E2E_MODE=true)
```

`dev:mocks` is the ONLY way to run the app without a backend — the plain dev servers require real backend access. Prefer it to verify UI changes.

## Storybook

```bash
npm run storybook   # root script, port 6009
```

## Lint / build / tests

Always scope to the workspace (never repo-wide):

```bash
npm run lint:fix --workspace=@pulse/<ws>
npm run build --workspace=@pulse/<ws>    # some workspaces have no build script (e.g. @pulse/e2e-mocks)
npm run test --workspace=@pulse/<ws> -- <file>
```

`npm run test:changed` (root) runs only the specs affected by the diff vs `origin/main`.
