import { describe, expect, it } from "vitest";

import { validateEnv } from "./env";

describe("validateEnv", () => {
  it("applies safe defaults during the setup phase", () => {
    const env = validateEnv({ NODE_ENV: "test" });

    expect(env.NODE_ENV).toBe("test");
    expect(env.NEXT_PUBLIC_APP_NAME).toBe("NOCScheduler");
    expect(env.DATABASE_URL).toBeUndefined();
  });

  it("rejects a malformed database URL when one is supplied", () => {
    expect(() =>
      validateEnv({
        NODE_ENV: "test",
        DATABASE_URL: "not-a-database-url",
      }),
    ).toThrow();
  });
});
