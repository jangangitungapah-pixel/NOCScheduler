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

test("my schedule switches desktop views and explains cross-midnight work", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/schedule/me");

  await page.getByRole("button", { name: "Month" }).click();
  await expect(page.getByRole("heading", { name: "month view" })).toBeVisible();

  await page.getByRole("button", { name: "Week" }).click();
  await expect(page.getByRole("heading", { name: "week view" })).toBeVisible();

  await page.getByRole("button", { name: "Agenda" }).click();
  await expect(page.getByRole("heading", { name: "Upcoming assignments" })).toBeVisible();
  await expect(page.getByText("23:00–07:00 (+1 hari)").first()).toBeVisible();
});

test("team schedule mobile recomposes between day and employee modes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/schedule/team");

  const mobile = page.getByLabel("Mobile team schedule");
  await expect(mobile).toBeVisible();
  await expect(mobile.getByRole("button", { name: "By Day" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await mobile.getByRole("button", { name: "By Employee" }).click();
  await expect(mobile.getByRole("button", { name: "By Employee" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(mobile.getByRole("combobox")).toHaveCount(1);
  await expect(mobile.getByRole("combobox")).toBeVisible();

  const overflow = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.documentScrollWidth).toBeLessThanOrEqual(overflow.viewportWidth);
});

test("manage schedule exposes desktop validation and focused mobile editing", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/schedule/manage");

  const desktop = page.locator(".product-manage-desktop");
  await expect(page.getByText("DRAFT", { exact: true })).toBeVisible();
  await expect(page.getByText("3 selected cells")).toBeVisible();
  await expect(desktop.getByRole("heading", { name: "Ready with warnings" })).toBeVisible();
  await expect(desktop.getByText("Revision impact", { exact: true })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  const editor = page.getByLabel("Focused mobile schedule editor");
  await expect(editor).toBeVisible();
  await expect(desktop).toBeHidden();
  await expect(editor.getByText("Step 1 · Choose work date")).toBeVisible();
  await expect(editor.getByText("Step 2 · Select employees")).toBeVisible();
  await expect(editor.getByText("Step 3 · Assign work state")).toBeVisible();

  const overflow = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.documentScrollWidth).toBeLessThanOrEqual(overflow.viewportWidth);
});

test("request create flow requires a reason before submission", async ({ page }) => {
  await page.goto("/schedule/requests?create=1");

  await expect(page.getByRole("heading", { name: "Operational schedule request" })).toBeVisible();
  const submit = page.getByRole("button", { name: "Submit request" });
  await expect(submit).toBeDisabled();

  await page.getByLabel("Request reason").fill("Need planned leave with explicit coverage review.");
  await expect(submit).toBeEnabled();
  await expect(page.getByText("Payroll awareness")).toBeVisible();
});

test("activity history drills into before and after audit context", async ({ page }) => {
  await page.goto("/activity");

  await page.getByRole("link", { name: /Published schedule correction/ }).click();
  await expect(page).toHaveURL(/\/activity\/AUD-8041$/);
  await expect(page.getByRole("heading", { name: "Activity Detail" })).toBeVisible();
  await expect(page.getByText("Before", { exact: true })).toBeVisible();
  await expect(page.getByText("After", { exact: true })).toBeVisible();
  await expect(page.getByText("Holiday coverage adjustment.")).toBeVisible();
});

test("payroll and employee detail preserve fixture drill-down routes", async ({ page }) => {
  await page.goto("/payroll/2026-08");
  await expect(page.getByRole("heading", { name: "Monthly Payroll", exact: true })).toBeVisible();
  await expect(page.getByText("Total calculated THP")).toBeVisible();

  await page.getByRole("link", { name: "Raka Pratama" }).click();
  await expect(page).toHaveURL(/\/payroll\/2026-08\/emp-001$/);
  await expect(page.getByText("Calculated take-home pay")).toBeVisible();

  await page.goto("/employees/emp-001/history");
  await expect(page.getByRole("heading", { name: "Employee History" })).toBeVisible();
  await expect(page.getByText("Published schedule correction")).toBeVisible();
});

test("canonical F03 routes render product surfaces instead of shell placeholders", async ({
  page,
}) => {
  const routes = [
    "/dashboard",
    "/schedule/me",
    "/schedule/team",
    "/schedule/manage",
    "/schedule/requests",
    "/employees",
    "/payroll",
    "/reports",
    "/activity",
    "/settings/shifts",
    "/notifications",
  ];

  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator(".app-route-placeholder"), route).toHaveCount(0);
  }
});
