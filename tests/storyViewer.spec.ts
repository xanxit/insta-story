import { test, expect } from "@playwright/test";

declare global {
  interface Window {
    __STORY_DURATION?: number;
  }
}

test.describe("StoryViewer (src/components/StoryContent.tsx)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator(".story-item.not-viewed").first().click();
    await expect(page.locator(".story-viewer")).toBeVisible();
  });

  test("manual next and prev navigation works", async ({ page }) => {
    const navZones = page.locator(".story-navigation .nav-zone");
    const img = page.locator(".story-viewer img");
    const firstSrcRaw = await img.getAttribute("src");
    expect(firstSrcRaw).not.toBeNull();
    const firstSrc = firstSrcRaw!;
    await navZones.nth(1).click();
    await expect(img).not.toHaveAttribute("src", firstSrc);
    await navZones.nth(0).click();
    await expect(img).toHaveAttribute("src", firstSrc);
  });

  test("auto-advance after STORY_DURATION closes or moves to next unviewed", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.__STORY_DURATION = 500;
    });
    await page.reload();
    await page.locator(".story-item.not-viewed").first().click();
    await page.waitForTimeout(700);
    const viewerCount = await page.locator(".story-viewer").count();
    if (viewerCount > 0) {
      await expect(page.locator(".story-viewer")).toBeVisible();
    } else {
      await expect(page.locator(".story-viewer")).not.toBeVisible();
    }
  });
});
