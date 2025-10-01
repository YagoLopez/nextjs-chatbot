import { NextResponse } from "next/server";
import { chromium } from "playwright";

// Force the function to be dynamic and not cached
export const dynamic = "force-dynamic";

export async function GET() {
  let browser = null;

  console.log("Starting scraper...");

  try {
    // Launch a new browser instance
    browser = await chromium.launch({
      headless: true, // Run in headless mode
    });

    const page = await browser.newPage();

    // Navigate to the page you want to scrape
    await page.goto("https://playwright.dev/");

    console.log("Page loaded. Scraping content...");

    // Scrape the content using locators
    const heading = await page.locator("h1").textContent();

    console.log("Scraping complete.");

    // Return the scraped data
    return NextResponse.json({ heading });
  } catch (error) {
    console.error("Error during scraping:", error);
    return NextResponse.json(
      { error: "Failed to scrape the page." },
      { status: 500 },
    );
  } finally {
    // Ensure the browser is closed even if an error occurs
    if (browser) {
      await browser.close();
      console.log("Browser closed.");
    }
  }
}
