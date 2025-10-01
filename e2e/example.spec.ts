import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Next.js/);
});

test('scrape heading', async ({ page }) => {
  await page.goto('/');

  // 1. Locate the main heading element.
  const heading = page.locator('h1');

  // 2. Extract the text content.
  const headingText = await heading.textContent();

  // 3. Print the scraped text to the console.
  console.log('Scraped Heading:', headingText);

  // Optional: You can also add an assertion to verify the content.
  await expect(heading).toContainText('Welcome'); // Change 'Welcome' to a word in your h1
});
