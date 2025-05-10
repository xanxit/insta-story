import { test, expect } from '@playwright/test';

test.describe('App (src/App.tsx)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => sessionStorage.clear());
  });

  test('toggles light/dark theme and persists in sessionStorage', async ({ page }) => {
    const app = page.locator('.app');
    const toggle = page.locator('.theme-toggle-btn');

    await expect(app).toHaveClass(/light-mode/);

    await toggle.click();
    await expect(app).toHaveClass(/dark-mode/);
    await expect(page.evaluate(() => sessionStorage.getItem('theme'))).resolves.toBe('dark');

    await page.reload();
    await expect(app).toHaveClass(/dark-mode/);
  });

  test('opens StoryViewer when clicking a story, and closes it', async ({ page }) => {
    const firstStory = page.locator('.story-item.not-viewed').first();
    await expect(firstStory).toBeVisible();
    await firstStory.click();
    await expect(page.locator('.story-viewer')).toBeVisible();
    await page.locator('.story-close').click();
    await expect(page.locator('.story-viewer')).not.toBeVisible();
  });

  test('shows pun-screen on upload and then continues to show new story', async ({ page }) => {
    const uploadSlot = page.locator('.story-item.upload');
    await uploadSlot.locator('input[type="file"]').setInputFiles('tests/fixtures/test-image.png');
    await expect(page.locator('.pun-screen')).toBeVisible();
    await page.locator('.pun-continue-btn').click();
    await expect(page.locator('.pun-screen')).not.toBeVisible();
    const newFirst = page.locator('.story-item:not(.upload)').first().locator('img');
    await expect(newFirst).toHaveAttribute('alt', 'Uploaded Story');
  });
});
