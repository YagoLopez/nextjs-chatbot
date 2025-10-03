import { ChatMistralAI } from "@langchain/mistralai";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { LangChainAdapter } from "ai";
import { NextRequest, NextResponse } from "next/server";
import Firecrawl from "@mendable/firecrawl-js";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  const { prompt: userInput } = await req.json();
  const remoteUrl = req.nextUrl.searchParams.get("url") || "";

  if (!remoteUrl) {
    return new Response("URL parameter is missing", { status: 400 });
  }

  try {
    const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });

    const scrapeResult = await firecrawl.scrapeUrl(remoteUrl, {
      formats: ["html"],
      onlyMainContent: true,
      maxAge: 3600,
    });
    debugger;
    if (!scrapeResult.html) {
      console.error("Failed to scrape website, no HTML content.", scrapeResult);
      return new Response("Failed to scrape the website.", { status: 500 });
    }

    // Load the HTML into cheerio
    const $ = cheerio.load(scrapeResult.html);

    // Remove script and style tags to clean up the text
    $("script, style").remove();

    // Extract text from the body, which is a common practice
    const plainText = $("body").text();

    if (!plainText) {
      return new Response("Could not extract text from the website.", {
        status: 500,
      });
    }

    const scrapedDocument = new Document({
      pageContent: plainText,
      metadata: scrapeResult.metadata || {},
    });

    const embeddings = new MistralAIEmbeddings({ model: "mistral-embed" });

    const vectorStore = new MemoryVectorStore(embeddings);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 3000,
      chunkOverlap: 400,
    });

    const chunkDocuments = await splitter.splitDocuments([scrapedDocument]);

    await vectorStore.addDocuments(chunkDocuments);

    const template = `Given this text: "{context}" I want you to give an answer this question "{question}".
  
    If you don't know the answer, just say that you couldn't find any information related in the provided context. 
    Don't try to make enough information to answer, don't try to make up an answer.
    Keep the answer as concise as possible.`;

    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["user", template],
    ]);

    const relatedDocs = await vectorStore.similaritySearch(userInput);

    const mergedRelatedDocs = relatedDocs
      .map((doc) => doc.pageContent)
      .join("\n");

    const llm = new ChatMistralAI({
      streamUsage: false,
      verbose: false,
      model: "mistral-small-2506",
      temperature: 0,
    });

    const llmInput = await promptTemplate.invoke({
      question: userInput,
      context: mergedRelatedDocs,
    });

    const stream = await llm.stream(llmInput);

    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (error) {
    console.error("[RAG API Error]", error);
    return NextResponse.json(
      { error: "An internal error occurred." },
      { status: 500 },
    );
  }
}
