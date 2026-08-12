import { expect, test } from "@playwright/test";

test("application shell entry and liveness endpoint are reachable", async ({ page, request }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  const response = await request.get("/api/health/live");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toEqual({
    status: "ok",
    service: "nocscheduler",
  });
});
