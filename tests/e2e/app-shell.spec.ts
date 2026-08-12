import { expect, test } from "@playwright/test";

test("desktop shell supports collapse, command navigation, and browser history", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/dashboard");

  const shell = page.locator(".app-shell");
  await expect(page.getByLabel("Sidebar aplikasi")).toBeVisible();
  await expect(page.getByLabel("Navigasi mobile")).toBeHidden();
  await expect(page.getByRole("link", { name: "Dashboard", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );

  await page.getByRole("button", { name: "Ciutkan sidebar" }).click();
  await expect(shell).toHaveAttribute("data-sidebar", "collapsed");
  await page.getByRole("button", { name: "Perluas sidebar" }).click();
  await expect(shell).toHaveAttribute("data-sidebar", "expanded");

  await page.keyboard.press("Control+K");
  const command = page.getByRole("dialog", { name: "Cari halaman" });
  await expect(command).toBeVisible();
  await command.getByRole("searchbox", { name: "Cari halaman atau perintah" }).fill("Payroll Overview");
  await command.getByRole("link", { name: /Payroll Overview/ }).click();

  await expect(page).toHaveURL(/\/payroll$/);
  await expect(page.getByRole("heading", { name: "Payroll Overview" })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});

test("mobile shell uses canonical bottom navigation without page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");

  await expect(page.getByLabel("Sidebar aplikasi")).toBeHidden();
  const mobileNavigation = page.getByLabel("Navigasi mobile");
  await expect(mobileNavigation).toBeVisible();

  for (const label of ["Home", "Schedule", "Team", "Payroll", "More"]) {
    await expect(mobileNavigation.getByText(label, { exact: true })).toBeVisible();
  }

  await mobileNavigation.getByRole("button", { name: "More" }).click();
  const moreSheet = page.getByRole("dialog", { name: "Lainnya" });
  await expect(moreSheet).toBeVisible();
  await expect(moreSheet.getByRole("link", { name: /Reports/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(moreSheet).toBeHidden();

  const overflow = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
  }));

  expect(overflow.documentScrollWidth).toBeLessThanOrEqual(overflow.viewportWidth);
});

test("saved dark theme is applied before the application shell hydrates", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("nocscheduler.theme", "dark");
  });

  await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("login route stays outside the authenticated application shell", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Authentication masuk pada WP-F05." })).toBeVisible();
  await expect(page.getByLabel("Sidebar aplikasi")).toHaveCount(0);
  await expect(page.getByLabel("Navigasi mobile")).toHaveCount(0);
});
