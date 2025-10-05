import { mistral } from "@ai-sdk/mistral";
import { /*convertToModelMessages,*/ streamText /*, UIMessage*/ } from "ai";
// import { ChatMistralAI } from "@langchain/mistralai";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
// import { ChatPromptTemplate } from "@langchain/core/prompts";

import { type NextRequest } from "next/server";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  debugger;
  const { prompt: userInput } = await req.json();

  const remoteUrl = req.nextUrl.searchParams.get("url") || "";

  // const llm = new ChatMistralAI({
  //   streamUsage: false,
  //   verbose: false,
  //   model: "mistral-large-latest",
  //   temperature: 0,
  // });

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

  // const template = `Given this text: "{context}" I want you to give an answer this question "{question}".
  //
  //   If you don't know the answer, just say that you couldn't find any information related in the provided context.
  //   Don't try to make enough information to answer, don't try to make up an answer.
  //   Keep the answer as concise as possible.`;

  const relatedDocs = await vectorStore.similaritySearch(userInput);

  const mergedRelatedDocs = relatedDocs
    .map((doc) => doc.pageContent)
    .join("\n");

  const template = `Based on this question asked by the user: "${userInput}" and the current context: "${mergedRelatedDocs}" retrieved from the webpage: "${remoteUrl}",
  
    I want you to give an answer what the user asked for".
  
    If you don't know the answer, just say that you couldn't find any information related in the provided context. 
    Don't try to make enough information to answer, don't try to make up an answer.
    Keep the answer as concise as possible.`;

  // const promptTemplate = ChatPromptTemplate.fromMessages([["user", template]]);

  // const llmInput = await promptTemplate.invoke({
  //   question: userInput,
  //   context: mergedRelatedDocs,
  // });

  console.log("template", template);

  const result = streamText({
    model: mistral("mistral-large-latest"),
    // prompt: [...llmInput.messages, userInput, mergedRelatedDocs],
    // prompt: [userInput, mergedRelatedDocs],
    prompt: template,
    system: `You are a helpful assistant. Answer the question asked by the user using as context the provided text retrieved from a web page`,
    // messages: convertToModelMessages(messages),
  });

  const res = result.toUIMessageStreamResponse();
  return res;
}
