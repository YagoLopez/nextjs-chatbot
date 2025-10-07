import { scrapingService } from "@/services/scraping-service";
import { URLS } from "@/lib/constants";

// Force the function to be dynamic and not cached
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const scrappedText = await scrapingService.scrapePage(URLS[1]);

    return new Response(scrappedText, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return new Response("Failed to scrape the page.", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
