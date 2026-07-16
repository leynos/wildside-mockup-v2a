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

## Spelling and diagram gates

Run `make spelling` to enforce en-GB-oxendict spelling across tracked files.
The gate pins Typos 1.48.0 and checks exact phrase corrections that Typos cannot
represent, including the required `hand-written` to `handwritten` correction.

The generated `typos.toml` combines the shared estate dictionary with the
repository-specific `typos.local.toml` overlay. Do not edit the generated file
directly. Use `make spelling-config-write` to refresh the untracked shared
dictionary cache when its authority is newer and regenerate the tracked file.
The quality gate uses `make spelling-config` to detect generated drift.

Run `make nixie` to validate Mermaid diagrams. The target installs the Merman
CLI 0.7.0 dependency before invoking Nixie CLI 1.1.0. CI provisions the same
versions.
