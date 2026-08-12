import { beforeEach, describe, expect, it, vi } from "vitest";

const navigation = vi.hoisted(() => ({
  redirect: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: navigation.redirect,
}));

import RootPage from "./page";

describe("root route contract", () => {
  beforeEach(() => {
    navigation.redirect.mockClear();
  });

  it("redirects the temporary authenticated fixture to the dashboard", () => {
    RootPage();

    expect(navigation.redirect).toHaveBeenCalledWith("/dashboard");
  });
});
