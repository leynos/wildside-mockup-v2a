# Developers guide

This guide records the local and Continuous Integration (CI) checks developers
are expected to run before submitting changes. It complements the project
scripts in `package.json` and the deeper design notes in `docs/`.

## Semantic lint gate

The `semantic-lint` CI workflow runs the `bun semantic` script. This is the
required lint gate for pull requests, and it must exercise the same semantic
checks locally and in CI:

- Biome checks over `src`, `tests`, `tools`, and `docs`.
- Class-list length checks for Tailwind utility strings.
- Near-duplicate Tailwind class checks.
- Semgrep rules from `tools/semgrep-semantic.yml`.
- Stylelint checks over `src/**/*.css`.

Run the gate locally with:

```bash
bun semantic
```

The semantic gate depends on `uvx` because the Semgrep step is executed through
`uvx semgrep`. Local development environments therefore need `uv` installed and
available on `PATH`. The CI workflow installs that dependency with
`astral-sh/setup-uv` before running `bun semantic`; the action is pinned to a
full commit SHA, with the upstream release tag retained in a comment for
upgrade traceability.

When changing the workflow, keep `tests/semantic-lint-workflow.test.ts` in sync.
That smoke test verifies that CI still installs `uvx` support before invoking
the semantic gate and that the third-party action remains pinned.
