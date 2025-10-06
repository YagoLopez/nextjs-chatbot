import { mistral } from "@ai-sdk/mistral";
import { streamText } from "ai";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

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

  const template = createPromptTemplate(
    userInput,
    mergedRelatedDocs,
    remoteUrl,
  );

  const result = streamText({
    model: mistral("mistral-medium-latest"),
    prompt: template,
    system: systemPrompt,
  });

  return result.toUIMessageStreamResponse();
}
