import { describe, expect, it } from "vitest";

import { validateEnv } from "./env";

describe("validateEnv", () => {
  it("applies safe defaults during the setup phase", () => {
    const env = validateEnv({ NODE_ENV: "test" });

    expect(env.NODE_ENV).toBe("test");
    expect(env.NEXT_PUBLIC_APP_NAME).toBe("NOCScheduler");
    expect(env.FIREBASE_PROJECT_ID).toBeUndefined();
  });

  it("accepts an explicit Firebase project ID", () => {
    const env = validateEnv({
      NODE_ENV: "test",
      FIREBASE_PROJECT_ID: "demo-nocscheduler",
    });

    expect(env.FIREBASE_PROJECT_ID).toBe("demo-nocscheduler");
  });
});
