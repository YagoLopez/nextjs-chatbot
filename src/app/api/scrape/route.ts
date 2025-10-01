import { chromium } from "playwright";
import { URLS } from "@/lib/constants";

// Force the function to be dynamic and not cached
export const dynamic = "force-dynamic";

export async function GET() {
  let browser = null;

  console.log("Starting scraper...");

  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(URLS[1]);

    console.log("Page loaded. Scraping content...");

    const heading = await page.locator("body").textContent();

    console.log("Scraping complete.");

    // Return the scraped data as plain text
    return new Response(heading || "No heading found.", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error during scraping:", error);
    // Also return the error as plain text
    return new Response("Failed to scrape the page.", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser closed.");
    }
  }
}
