import { expect, test } from "@playwright/test";

test("application baseline and liveness endpoint are reachable", async ({ page, request }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "NOCScheduler" })).toBeVisible();
  await expect(page.getByText("WP-F00 Engineering Baseline")).toBeVisible();

  const response = await request.get("/api/health/live");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toEqual({
    status: "ok",
    service: "nocscheduler",
  });
});
