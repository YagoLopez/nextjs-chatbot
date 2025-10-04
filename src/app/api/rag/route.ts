import { ChatMistralAI } from "@langchain/mistralai";
// import { MistralAIEmbeddings } from "@langchain/mistralai";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
//
// import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
// import { ChatPromptTemplate } from "@langchain/core/prompts";

import { LangChainAdapter } from "ai";
// import { type NextRequest /*NextResponse*/ } from "next/server";

export async function POST(/*req: NextRequest*/) {
  // const { prompt: userInput } = await req.json();
  // const remoteUrl =
  //   req.nextUrl.searchParams.get("url") ||
  //   "https://lilianweng.github.io/posts/2023-06-23-agent/";

  const llm = new ChatMistralAI({
    streamUsage: false,
    verbose: false,
    model: "mistral-large-latest",
    temperature: 0,
  });

  // const embeddings = new MistralAIEmbeddings({ model: "mistral-embed" });
  //
  //  const vectorStore = new MemoryVectorStore(embeddings);
  //
  //  const cheerioLoader = new CheerioWebBaseLoader(remoteUrl, { selector: "p" });
  //
  //  const htmlText = await cheerioLoader.load();
  //
  //  const splitter = new RecursiveCharacterTextSplitter({
  //    chunkSize: 3000,
  //    chunkOverlap: 400,
  //  });
  // const chunkDocuments = await splitter.splitDocuments(htmlText);

  // await vectorStore.addDocuments(chunkDocuments);

  // const template = `Given this text: "{context}" I want you to give an answer this question "{question}".
  //
  //   If you don't know the answer, just say that you couldn't find any information related in the provided context.
  //   Don't try to make enough information to answer, don't try to make up an answer.
  //   Keep the answer as concise as possible.`;
  // const promptTemplate = ChatPromptTemplate.fromMessages([["user", template]]);

  // const relatedDocs = await vectorStore.similaritySearch(userInput);
  // console.log("relateddocs", relatedDocs);

  // const mergedRelatedDocs = relatedDocs
  //   .map((doc) => doc.pageContent)
  //   .join("\n");

  // const llmInput = await promptTemplate.invoke({
  //   question: "Cómo te llamas?",
  //   context: "Mi nombre es Pepe",
  // });
  // const llmInput = await promptTemplate.invoke({
  //   question: userInput,
  //   context: mergedRelatedDocs,
  // });

  const stream = await llm.stream("hola cómo estas?");
  return LangChainAdapter.toDataStreamResponse(stream);
}
