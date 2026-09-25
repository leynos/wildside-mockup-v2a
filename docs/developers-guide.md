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

When changing the workflow, keep `tests/semantic-lint-workflow.test.ts` in
sync. That smoke test verifies that CI installs each dependency before invoking
the semantic, spelling, and diagram gates, and that the third-party action
remains pinned. It checks the pin's shape, not one version, because Dependabot
moves the pin. The `lint` job checks out with `persist-credentials: false` and
a read-only token, because it runs pull-request-controlled scripts.

## Pull-request build and tests

The same workflow runs a `build-test` job on every pull request and on pushes to
`main` and `develop`. It runs `bun install --frozen-lockfile`,
`bun run tokens:build`, `bun run build` and `bun run test` on `ubuntu-latest`,
with a `contents: read` token, a checkout that does not persist credentials,
and actions pinned to full commit SHAs. The job is not a matrix, so it reports
under the single context `build-test`, which is a required check beside `lint`.
Before it existed, no pull-request job built the site or ran the suite, so
automerge could land a Dependabot bump that broke either.

`tests/build-test-workflow.test.ts` holds that contract. `buildTestViolations`
lists every way the job could stop protecting `main`, and mutation cases feed
it altered copies of the real workflow so each rule is proved to fire. The
`lint` job runs this file too, so deleting `build-test` still fails a check
that runs.

The suite runs under happy-dom. `tests/setup-happy-dom.ts` copies the browser
globals the app and its libraries reach for onto `globalThis`, including
`HTMLFormElement` (Radix's slider tests `instanceof HTMLFormElement`) and
`scrollTo`. When a test fails with `ReferenceError: X is not defined`, add `X`
there from the happy-dom window. Query Radix toggle groups by the roles Radix
renders: `toolbar` for a multiple-selection root and `radiogroup` for a
single-selection root.

## Spelling and diagram gates

Run `make spelling` to enforce en-GB-oxendict spelling across tracked files.
The gate pins Typos 1.48.0 and checks exact phrase corrections that Typos
cannot represent, including the required `hand-written` to `handwritten`
correction.

The generated `typos.toml` combines the shared estate dictionary with the
repository-specific `typos.local.toml` overlay. Do not edit the generated file
directly. Use `make spelling-config-write` to refresh the untracked shared
dictionary cache when its authority is newer and regenerate the tracked file.
The quality gate uses `make spelling-config` to detect generated drift.

The standalone checker tests pin Hypothesis 6.156.6 to exercise phrase
boundaries over generated neighbouring characters. A subprocess test also
protects the command-line boundary from argument parsing through diagnostic
output.

Run `make nixie` to validate Mermaid diagrams. The target installs the Merman
CLI 0.7.0 dependency before invoking Nixie CLI 1.1.0. CI provisions the same
versions.
