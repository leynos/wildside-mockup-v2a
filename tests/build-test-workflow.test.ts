/**
 * @file Contract for the pull-request `build-test` job that gates automerge.
 *
 * `build-test` is a required check and the only pull-request job that builds
 * the site and runs the suite. Without it, automerge could land a Dependabot
 * bump that broke either. `buildTestViolations` lists every way the job could
 * stop protecting `main`, and the mutation cases below feed it altered copies
 * of the real workflow, so each rule is proved to fire. The `lint` job runs
 * this file too, so deleting `build-test` still fails a check that runs.
 */
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

const workflowPath = ".github/workflows/semantic-lint.yml";
const jobName = "build-test";
const runner = "ubuntu-latest";
const commands = [
  "bun install --frozen-lockfile",
  "bun run tokens:build",
  "bun run build",
  "bun run test",
];
// Filters that would stop the job running on an ordinary pull request.
const pullRequestFilters = ["branches", "branches-ignore", "paths", "paths-ignore", "types"];
const checkoutPin = /^actions\/checkout@[0-9a-f]{40}$/;
const setupBunPin = /^oven-sh\/setup-bun@[0-9a-f]{40}$/;

interface Step {
  run?: string;
  uses?: string;
  with?: Record<string, unknown>;
  if?: unknown;
  "continue-on-error"?: unknown;
}

interface Job {
  "runs-on"?: unknown;
  permissions?: unknown;
  if?: unknown;
  "continue-on-error"?: unknown;
  strategy?: unknown;
  steps?: Step[];
}

interface Triggers {
  push?: { branches?: string[] } | null;
  pull_request?: Record<string, unknown> | null;
  [trigger: string]: unknown;
}

interface Workflow {
  on?: Triggers;
  true?: Triggers;
  jobs: Record<string, Job>;
}

/**
 * Parse the workflow that owns `build-test`.
 *
 * @example
 * ```ts
 * readWorkflow().jobs["build-test"]?.["runs-on"]; // "ubuntu-latest"
 * ```
 *
 * @returns The parsed workflow.
 */
function readWorkflow(): Workflow {
  return Bun.YAML.parse(readFileSync(workflowPath, "utf8")) as Workflow;
}

/**
 * List the ways a workflow fails to run `build-test` on every pull request.
 *
 * @example
 * ```ts
 * buildTestViolations(readWorkflow()); // []
 * ```
 *
 * @param workflow - A parsed workflow.
 * @returns One message per broken rule; empty when the job is sound.
 */
function buildTestViolations(workflow: Workflow): string[] {
  const job = workflow.jobs[jobName];
  if (job === undefined) return [`${jobName} job is missing`];
  return [...triggerViolations(workflow.on ?? workflow.true ?? {}), ...jobViolations(job)];
}

/**
 * List trigger problems: no `pull_request`, a narrowing filter, or no push to `main`.
 *
 * @example
 * ```ts
 * triggerViolations({ pull_request: null, push: { branches: ["main"] } }); // []
 * ```
 *
 * @param triggers - The workflow's `on` mapping.
 * @returns One message per broken trigger rule.
 */
function triggerViolations(triggers: Triggers): string[] {
  const violations: string[] = [];
  if (!("pull_request" in triggers)) violations.push("no pull_request trigger");
  const filters = pullRequestFilters.filter((filter) => filter in (triggers.pull_request ?? {}));
  if (filters.length > 0) violations.push(`pull_request is narrowed by ${filters.join(", ")}`);
  if (!(triggers.push?.branches ?? []).includes("main"))
    violations.push("no push trigger for main");
  return violations;
}

/**
 * List job problems: runner, token scope, skip or soft-fail switches, commands and pins.
 *
 * @example
 * ```ts
 * jobViolations(readWorkflow().jobs["build-test"]); // []
 * ```
 *
 * @param job - The `build-test` job.
 * @returns One message per broken job rule.
 */
function jobViolations(job: Job): string[] {
  const violations: string[] = [];
  const steps = job.steps ?? [];
  if (job["runs-on"] !== runner) violations.push(`runs-on is not ${runner}`);
  if (JSON.stringify(job.permissions) !== JSON.stringify({ contents: "read" })) {
    violations.push("permissions are not exactly contents: read");
  }
  // A matrix reports under suffixed names no required context matches; `if:`
  // can skip work and `continue-on-error` can hide a failure, both green.
  if (job.strategy !== undefined) violations.push("job has a matrix strategy");
  if (job.if !== undefined) violations.push("job has an if");
  if (job["continue-on-error"] !== undefined) violations.push("job has continue-on-error");
  if (steps.some((step) => step.if !== undefined)) violations.push("a step has an if");
  if (steps.some((step) => step["continue-on-error"] !== undefined)) {
    violations.push("a step has continue-on-error");
  }
  const runs = steps.flatMap((step) => (step.run === undefined ? [] : [step.run.trim()]));
  if (JSON.stringify(runs) !== JSON.stringify(commands)) violations.push("commands differ");
  const checkout = steps.find((step) => step.uses?.startsWith("actions/checkout@"));
  if (!checkoutPin.test(checkout?.uses ?? "")) violations.push("checkout is not pinned to a SHA");
  if (checkout?.with?.["persist-credentials"] !== false) {
    violations.push("checkout persists credentials");
  }
  const setupBun = steps.find((step) => step.uses?.startsWith("oven-sh/setup-bun@"));
  if (!setupBunPin.test(setupBun?.uses ?? "")) violations.push("setup-bun is not pinned to a SHA");
  return violations;
}

/**
 * Return a deep copy of the real workflow with one edit applied to `build-test`.
 *
 * @example
 * ```ts
 * mutated((wf) => { delete wf.jobs["build-test"]; });
 * ```
 *
 * @param edit - The change to apply to the copy.
 * @returns The altered copy.
 */
function mutated(edit: (workflow: Workflow) => void): Workflow {
  const copy = structuredClone(readWorkflow());
  edit(copy);
  return copy;
}

/**
 * Return the `build-test` job of a workflow copy, failing if it is absent.
 *
 * @example
 * ```ts
 * job(mutated(() => {})).steps?.length; // 6
 * ```
 *
 * @param workflow - A workflow copy.
 * @returns Its `build-test` job.
 */
function job(workflow: Workflow): Job {
  const found = workflow.jobs[jobName];
  if (found === undefined) throw new Error(`${jobName} missing from the copy`);
  return found;
}

/**
 * Return a job's first step whose `uses` starts with a prefix, failing if absent.
 *
 * @example
 * ```ts
 * stepUsing(job(readWorkflow()), "actions/checkout@").with; // { "persist-credentials": false }
 * ```
 *
 * @param target - The job to search.
 * @param prefix - The action reference prefix.
 * @returns The matching step.
 */
function stepUsing(target: Job, prefix: string): Step {
  const found = (target.steps ?? []).find((step) => step.uses?.startsWith(prefix));
  if (found === undefined) throw new Error(`no step uses ${prefix}`);
  return found;
}

/**
 * Return a workflow copy's trigger mapping, whichever key the parser used.
 *
 * @example
 * ```ts
 * "pull_request" in triggersOf(readWorkflow()); // true
 * ```
 *
 * @param workflow - A workflow copy.
 * @returns Its `on` mapping.
 */
function triggersOf(workflow: Workflow): Triggers {
  const triggers = workflow.on ?? workflow.true;
  if (triggers === undefined) throw new Error("workflow copy has no triggers");
  return triggers;
}

const mutations: [string, (workflow: Workflow) => void][] = [
  ["delete the job", (wf) => delete wf.jobs[jobName]],
  ["drop pull_request", (wf) => delete triggersOf(wf).pull_request],
  ["narrow pull_request", (wf) => (triggersOf(wf).pull_request = { types: ["closed"] })],
  ["drop push to main", (wf) => (triggersOf(wf).push = { branches: ["develop"] })],
  ["change the runner", (wf) => (job(wf)["runs-on"] = "self-hosted")],
  ["widen permissions", (wf) => (job(wf).permissions = { contents: "write" })],
  ["add a matrix", (wf) => (job(wf).strategy = { matrix: { os: [runner] } })],
  ["add a job if", (wf) => (job(wf).if = false)],
  ["soft-fail the job", (wf) => (job(wf)["continue-on-error"] = true)],
  [
    "skip a step",
    (wf) => ((job(wf).steps ?? [])[2] = { run: "bun install --frozen-lockfile", if: false }),
  ],
  [
    "soft-fail a step",
    (wf) => (stepUsing(job(wf), "oven-sh/setup-bun@")["continue-on-error"] = true),
  ],
  [
    "drop bun run test",
    (wf) => (job(wf).steps = (job(wf).steps ?? []).filter((s) => s.run !== "bun run test")),
  ],
  [
    "tag-pin checkout",
    (wf) => (stepUsing(job(wf), "actions/checkout@").uses = "actions/checkout@v7"),
  ],
  ["persist credentials", (wf) => (stepUsing(job(wf), "actions/checkout@").with = {})],
  [
    "tag-pin setup-bun",
    (wf) => (stepUsing(job(wf), "oven-sh/setup-bun@").uses = "oven-sh/setup-bun@v2"),
  ],
];

describe("build-test workflow contract", () => {
  it("runs build-test soundly on every pull request", () => {
    expect(buildTestViolations(readWorkflow())).toEqual([]);
  });

  it.each(mutations)("refuses a workflow that would %s", (_name, edit) => {
    expect(buildTestViolations(mutated(edit)).length).toBeGreaterThan(0);
  });
});
