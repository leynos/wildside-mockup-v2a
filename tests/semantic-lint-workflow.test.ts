/** @file Guards the semantic lint workflow wiring that CI executes. */
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

const workflowPath = ".github/workflows/semantic-lint.yml";
// Dependabot moves the pin daily, so the contract holds its shape (a full
// commit SHA with the release recorded on the line above), not one version.
const setupUvPin =
  /# astral-sh\/setup-uv v\d+\.\d+\.\d+\n\s*- uses: astral-sh\/setup-uv@[0-9a-f]{40}\n/;
const makeVariableSigil = "$";
const buildTestCommands = [
  "bun install --frozen-lockfile",
  "bun run tokens:build",
  "bun run build",
  "bun run test",
];

interface ParsedStep {
  run?: string;
  uses?: string;
  with?: Record<string, unknown>;
  if?: unknown;
  "continue-on-error"?: unknown;
}

// Filters that would stop `build-test` running on an ordinary pull request.
const pullRequestFilters = ["branches", "branches-ignore", "paths", "paths-ignore", "types"];

interface ParsedTriggers {
  push?: { branches?: string[] } | null;
  pull_request?: Record<string, unknown> | null;
  [trigger: string]: unknown;
}

interface ParsedWorkflow {
  on?: ParsedTriggers;
  true?: ParsedTriggers;
  jobs: Record<
    string,
    { if?: unknown; "continue-on-error"?: unknown; strategy?: unknown; steps?: ParsedStep[] }
  >;
}

const readWorkflow = () => Bun.file(workflowPath).text();

describe("semantic lint workflow", () => {
  it("runs semantic, spelling, and diagram gates in dependency order", async () => {
    const workflow = await readWorkflow();
    const orderedSteps = [
      "- uses: astral-sh/setup-uv@",
      "- run: bun semantic",
      "run: make spelling",
      "uv tool install --python 3.14 nixie-cli==1.1.0",
      "cargo +1.95.0 install merman-cli",
      `--version "=${makeVariableSigil}{MERMAN_CLI_VERSION}" --locked`,
      "run: make nixie",
    ];
    const indices = orderedSteps.map((step) => workflow.indexOf(step));

    expect(indices.every((index) => index >= 0)).toBe(true);
    expect(indices).toEqual([...indices].sort((left, right) => left - right));
    expect(workflow).toContain("bun install --frozen-lockfile");
  });

  it("pins setup-uv to a full commit SHA while recording the release tag", async () => {
    const workflow = await readWorkflow();

    expect(workflow).toMatch(setupUvPin);
    expect(workflow).not.toMatch(/uses: astral-sh\/setup-uv@v\d/);
  });

  it("builds and tests on every pull request in a single unconditional build-test job", () => {
    const workflow = Bun.YAML.parse(readFileSync(workflowPath, "utf8")) as ParsedWorkflow;
    const triggers: ParsedTriggers = workflow.on ?? workflow.true ?? {};
    const job = workflow.jobs["build-test"];

    expect(Object.keys(triggers)).toContain("pull_request");
    // `pull_request: { types: [closed] }` would still name the trigger while
    // never running the job on an opened or updated pull request.
    const pullRequest = triggers.pull_request ?? {};
    expect(pullRequestFilters.filter((filter) => filter in pullRequest)).toEqual([]);
    expect(triggers.push?.branches ?? []).toContain("main");
    expect(job).toBeDefined();
    // A matrix reports under suffixed names no required context matches, and
    // an `if:` could skip the job or a step and still pass.
    expect(job?.strategy).toBeUndefined();
    expect(job?.if).toBeUndefined();
    // `continue-on-error` would let a failing command leave the job green.
    expect(job?.["continue-on-error"]).toBeUndefined();
    const runSteps = (job?.steps ?? []).filter((step) => step.run !== undefined);
    expect(runSteps.map((step) => step.run?.trim())).toEqual(buildTestCommands);
    expect(runSteps.every((step) => step.if === undefined)).toBe(true);
    expect(runSteps.every((step) => step["continue-on-error"] === undefined)).toBe(true);
    const checkout = (job?.steps ?? []).find((step) => step.uses?.startsWith("actions/checkout@"));
    // The build and tests run dependency code that needs no Git token.
    expect(checkout?.with?.["persist-credentials"]).toBe(false);
  });
});
