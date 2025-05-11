import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

test.describe('StoryList (src/components/StoryList.tsx)', () => {
  test('renders exactly one upload slot plus all JSON stories', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('.story-list .story-item');
    const jsonPath = path.resolve(process.cwd(), 'src/data/stories.json');
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const storiesData = JSON.parse(raw) as { id: number; imageUrl: string; altText: string; viewed: boolean; }[];
    await expect(items).toHaveCount(storiesData.length + 1);
  });

  test('clicking a story-item calls onStoryClick (opens viewer)', async ({ page }) => {
    await page.goto('/');
    const second = page.locator('.story-item.not-viewed').nth(1);
    await second.click();
    await expect(page.locator('.story-viewer')).toBeVisible();
  });
});