import { createOpenAI, openai } from "@ai-sdk/openai";
import { mistral } from "@ai-sdk/mistral";
import { streamText } from "ai";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { openrouter } from "@openrouter/ai-sdk-provider";

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

import { type NextRequest } from "next/server";
import { createPromptTemplate, systemPrompt } from "@/lib/utils";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { prompt: userInput } = await req.json();

  const remoteUrl = req.nextUrl.searchParams.get("url") || "";

  const embeddings = new MistralAIEmbeddings({ model: "mistral-embed" });

  const vectorStore = new MemoryVectorStore(embeddings);

  const cheerioLoader = new CheerioWebBaseLoader(remoteUrl, { selector: "p" });

  const htmlText = await cheerioLoader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 3000,
    chunkOverlap: 400,
  });

  const chunkDocuments = await splitter.splitDocuments(htmlText);

  await vectorStore.addDocuments(chunkDocuments);

  const relatedDocs = await vectorStore.similaritySearch(userInput);

  const mergedRelatedDocs = relatedDocs
    .map((doc) => doc.pageContent)
    .join("\n");

  const openai = createOpenAI({
    apiKey:
      "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",
    // headers: {
    //   "header-name": "header-value",
    // },
  });

  const template = createPromptTemplate(
    userInput,
    mergedRelatedDocs,
    remoteUrl,
  );
  const result = streamText({
    model: openrouter("openai/gpt-4o"),
    prompt: template,
    system: systemPrompt,
  });

  // const result = streamText({
  //   model: openai("gpt-5"),
  //   prompt: template,
  //   system: systemPrompt,
  // });

  // const result = streamText({
  //   model: mistral("mistral-medium-latest"),
  //   prompt: template,
  //   system: systemPrompt,
  // });

  return result.toUIMessageStreamResponse();
}
