import { expect, test } from "@playwright/test";

test(
  "design-system reference supports theme persistence and keyboard controls",
  async ({ page }) => {
    await page.goto("/design-system");

    await expect(page.getByRole("heading", { name: "NOCScheduler Design System" })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.getByRole("button", { name: /aktifkan mode gelap/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    const month = page.getByRole("radio", { name: "Month" });
    await month.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("radio", { name: "Week" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(page.getByRole("radio", { name: "Week" })).toBeFocused();
  },
);

test("design-system reference contains page overflow on compact mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/design-system");

  const hasPageOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  expect(hasPageOverflow).toBe(false);
  await expect(page.getByText("Schedule cell anatomy")).toBeVisible();
});

test("design-system reference respects reduced-motion preference", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/design-system");

  const motionDuration = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--motion-standard").trim(),
  );

  expect(motionDuration).toBe("1ms");
});

test("dialog remains keyboard dismissible", async ({ page }) => {
  await page.goto("/design-system");
  await page.getByRole("button", { name: "Dialog" }).click();

  const dialog = page.getByRole("dialog", { name: "Edit assignment" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
