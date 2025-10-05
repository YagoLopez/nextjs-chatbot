import { mistral } from "@ai-sdk/mistral";
import { streamText } from "ai";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

import { type NextRequest } from "next/server";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  debugger;
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

  const template = `Based on this question asked by the user: "${userInput}" and the current context: "${mergedRelatedDocs}" retrieved from the webpage: "${remoteUrl}",
  
    I want you to give an answer what the user asked for".
  
    If you don't know the answer, just say that you couldn't find any information related in the provided context. 
    Don't try to make enough information to answer, don't try to make up an answer.
    Keep the answer as concise as possible.`;

  const result = streamText({
    model: mistral("mistral-large-latest"),
    prompt: template,
    system: `You are a helpful assistant. Answer the question asked by the user using as context the provided text retrieved from a web page`,
  });

  return result.toUIMessageStreamResponse();
}
