/** @file Guards the semantic lint workflow wiring that CI executes. */
import { describe, expect, it } from "bun:test";

const workflowPath = ".github/workflows/semantic-lint.yml";
const setupUvPinnedAction = "astral-sh/setup-uv@fac544c07dec837d0ccb6301d7b5580bf5edae39";
const makeVariableSigil = "$";

const readWorkflow = () => Bun.file(workflowPath).text();

describe("semantic lint workflow", () => {
  it("runs semantic, spelling, and diagram gates in dependency order", async () => {
    const workflow = await readWorkflow();
    const orderedSteps = [
      setupUvPinnedAction,
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

    expect(workflow).toContain("# astral-sh/setup-uv v8.2.0");
    expect(workflow).toContain(`- uses: ${setupUvPinnedAction}`);
    expect(workflow).not.toContain("uses: astral-sh/setup-uv@v8.2.0");
  });
});
