import { describe, expect, it } from "bun:test";
import { buildWizardRouteStats } from "../src/app/features/wizard/step-three/build-wizard-route-stats";
import { createStubT } from "./i18n-stub";

describe("buildWizardRouteStats", () => {
  it("localizes wizard route stat units", () => {
    const { t: stubT, calls } = createStubT();

    const stats = buildWizardRouteStats(stubT, "en-GB", "metric");

    expect(stats).toHaveLength(3);

    const distanceStat = stats.find((stat) => stat.id === "distance");
    expect(distanceStat?.value).toBe("3.7");
    expect(distanceStat?.unitLabel).toBe("km");

    const durationStat = stats.find((stat) => stat.id === "duration");
    expect(durationStat?.unitLabel).toBe("minutes");

    const stopsStat = stats.find((stat) => stat.id === "stops");
    expect(stopsStat?.unitLabel).toBe("stops");

    const distanceCall = calls.find((call) => call.key === "unit-distance-kilometre");
    expect(distanceCall?.options?.defaultValue).toBe("km");

    const durationCall = calls.find((call) => call.key === "wizard-step-three-route-duration-unit");
    expect(durationCall?.options?.defaultValue).toBe("minutes");
    expect(durationCall?.options?.count).toBe(45);

    const stopsCall = calls.find((call) => call.key === "wizard-step-three-route-stops-unit");
    expect(stopsCall?.options?.defaultValue).toBe("stops");
    expect(stopsCall?.options?.count).toBe(7);
  });
});
