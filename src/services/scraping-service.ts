import { chromium, Browser } from "playwright";

class ScrapingService {
  private static instance: ScrapingService;
  private browser: Browser | null = null;

  private constructor() {}

  public static getInstance(): ScrapingService {
    if (!ScrapingService.instance) {
      ScrapingService.instance = new ScrapingService();
    }
    return ScrapingService.instance;
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser || !this.browser.isConnected()) {
      console.log("Launching new browser instance...");
      this.browser = await chromium.launch({ headless: true });
    }
    return this.browser;
  }

  public async scrapePage(url: string): Promise<string> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    try {
      await page.goto(url);
      const body = await page.evaluate(() => document.body.innerText);
      return body || "No body found.";
    } finally {
      await page.close();
    }
  }

  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log("Browser closed.");
    }
  }
}

export const scrapingService = ScrapingService.getInstance();
