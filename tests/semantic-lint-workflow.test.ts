/** @file Guards the semantic lint workflow wiring that CI executes. */
import { describe, expect, it } from "bun:test";

const workflowPath = ".github/workflows/semantic-lint.yml";
// Dependabot moves the pin daily, so the contract holds its shape (a full
// commit SHA with the release recorded on the line above), not one version.
const setupUvPin =
  /# astral-sh\/setup-uv v\d+\.\d+\.\d+\n\s*- uses: astral-sh\/setup-uv@[0-9a-f]{40}\n/;
const makeVariableSigil = "$";
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
});
