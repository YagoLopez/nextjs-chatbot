import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("test");
  const remoteUrl =
    req.nextUrl.searchParams.get("url") ||
    "https://lilianweng.github.io/posts/2023-06-23-agent/";

  debugger;
  // if (!remoteUrl) {
  //   return new Response("URL parameter is missing", { status: 400 });
  // }

  try {
    const cheerioLoader = new CheerioWebBaseLoader(remoteUrl, {
      selector: "p",
    });
    const scrapeResponse = await cheerioLoader.load();

    if (!scrapeResponse || scrapeResponse.length === 0) {
      return new Response("Could not find any content on the page.", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // Return the scraped content as plain text
    return new Response(scrapeResponse[0].pageContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error during scraping:", error);
    return new Response("Failed to scrape the page.", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
