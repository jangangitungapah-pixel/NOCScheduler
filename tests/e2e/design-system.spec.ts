import { expect, test } from "@playwright/test";

test("design-system reference supports theme persistence and keyboard controls", async ({
  page,
}) => {
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
  await expect(page.getByRole("radio", { name: "Week" })).toHaveAttribute("aria-checked", "true");
  await expect(page.getByRole("radio", { name: "Week" })).toBeFocused();
});

test("design-system reference contains page overflow on compact mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/design-system");

  const overflowReport = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const offenders = Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          className: element.className,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          overflowX: getComputedStyle(element).overflowX,
        };
      })
      .filter((element) => element.left < -1 || element.right > viewportWidth + 1)
      .slice(0, 30);

    return {
      viewportWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      offenders,
    };
  });

  expect(
    overflowReport.documentScrollWidth,
    JSON.stringify(overflowReport, null, 2),
  ).toBeLessThanOrEqual(overflowReport.viewportWidth);
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
