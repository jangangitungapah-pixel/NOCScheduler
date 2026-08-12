import { expect, test } from "@playwright/test";

test("dashboard renders high-fidelity operational fixture surface", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/dashboard");

  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText("Your shift today")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Now on duty" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Operational attention" })).toBeVisible();
  await expect(page.locator(".app-route-placeholder")).toHaveCount(0);
});

test("my schedule stays compact and overflow-safe on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/schedule/me");

  await expect(page.getByRole("heading", { name: "My Schedule" })).toBeVisible();
  await expect(page.getByLabel("Compact schedule date strip")).toBeVisible();
  await expect(page.getByText("Upcoming assignments")).toBeVisible();

  const overflow = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
  }));

  expect(overflow.documentScrollWidth).toBeLessThanOrEqual(overflow.viewportWidth);
});

test("manage schedule exposes draft, bulk selection, validation, and publish review", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/schedule/manage");

  await expect(page.getByText("DRAFT", { exact: true })).toBeVisible();
  await expect(page.getByText("3 selected cells")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ready with warnings" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Revision impact" })).toBeVisible();
});

test("payroll and employee detail preserve fixture drill-down routes", async ({ page }) => {
  await page.goto("/payroll/2026-08");
  await expect(
    page.getByRole("heading", { name: "Monthly Payroll", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Total calculated THP")).toBeVisible();

  await page.getByRole("link", { name: "Raka Pratama" }).click();
  await expect(page).toHaveURL(/\/payroll\/2026-08\/emp-001$/);
  await expect(page.getByText("Calculated take-home pay")).toBeVisible();

  await page.goto("/employees/emp-001/history");
  await expect(page.getByRole("heading", { name: "Employee History" })).toBeVisible();
  await expect(page.getByText("Published schedule correction")).toBeVisible();
});
