# Branch Protection — Recommended Settings

Configure these in **Settings → Branches → Branch protection rules** for `main`:

## Required Settings

- [x] **Require status checks to pass before merging**
  - Add required checks: `Lint & Typecheck`, `Build`
- [x] **Require branches to be up to date before merging**
- [x] **Do not allow force pushes**
- [x] **Do not allow deletions**

## Recommended (when you have contributors)

- [ ] **Require a pull request before merging**
  - Require 1 approval
  - Dismiss stale reviews when new commits are pushed
- [ ] **Require conversation resolution before merging**

## Repository Settings

Under **Settings → General**:

- [x] **Automatically delete head branches** after merge
- [x] **Always suggest updating pull request branches**

## How to Create a Release

```bash
git tag v0.1.0
git push origin v0.1.0
```

This triggers the release workflow which builds the project and creates a GitHub Release with auto-generated changelog. Vercel handles the actual deployment via its GitHub integration.
