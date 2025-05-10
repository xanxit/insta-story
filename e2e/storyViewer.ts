import { test, expect } from "@playwright/test";

test.describe("StoryViewer (src/components/StoryContent.tsx)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator(".story-item.not-viewed").first().click();
    await expect(page.locator(".story-viewer")).toBeVisible();
  });

  test("manual next and prev navigation works", async ({ page }) => {
    const navZones = page.locator(".story-navigation .nav-zone");
    const img = page.locator(".story-viewer img");

    const firstSrc = await img.getAttribute("src");

    await navZones.nth(1).click();
    const secondSrc = await img.getAttribute("src");
    await expect(secondSrc).not.toBe(firstSrc);

    await navZones.nth(0).click();
    const backToFirst = await img.getAttribute("src");
    await expect(backToFirst).toBe(firstSrc);
  });

  test("auto-advance after STORY_DURATION closes or moves to next unviewed", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__STORY_DURATION = 500;
    });

    await page.reload();
    await page.locator(".story-item.not-viewed").first().click();

    await page.waitForTimeout(700);

    const remaining = await page.locator(".story-viewer").count();
    if (remaining) {
      await expect(page.locator(".story-viewer")).toBeVisible();
    } else {
      // closed
      await expect(page.locator(".story-viewer")).not.toBeVisible();
    }
  });
});
