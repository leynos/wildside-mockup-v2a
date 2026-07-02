/** @file Guards the semantic lint workflow wiring that CI executes. */
import { describe, expect, it } from "bun:test";

const workflowPath = ".github/workflows/semantic-lint.yml";
const setupUvPinnedAction = "astral-sh/setup-uv@37802adc94f370d6bfd71619e3f0bf239e1f3b78";

const readWorkflow = () => Bun.file(workflowPath).text();

describe("semantic lint workflow", () => {
  it("runs the semantic gate after installing uvx support", async () => {
    const workflow = await readWorkflow();
    const setupUvStepIndex = workflow.indexOf(setupUvPinnedAction);
    const semanticGateIndex = workflow.indexOf("- run: bun semantic");

    expect(setupUvStepIndex).toBeGreaterThanOrEqual(0);
    expect(semanticGateIndex).toBeGreaterThan(setupUvStepIndex);
    expect(workflow).toContain("bun install --frozen-lockfile");
  });

  it("pins setup-uv to a full commit SHA while recording the release tag", async () => {
    const workflow = await readWorkflow();

    expect(workflow).toContain("# astral-sh/setup-uv v7");
    expect(workflow).toContain(`- uses: ${setupUvPinnedAction}`);
    expect(workflow).not.toContain("uses: astral-sh/setup-uv@v7");
  });
});
