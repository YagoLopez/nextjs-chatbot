import { ChatMistralAI } from "@langchain/mistralai";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { LangChainAdapter } from "ai";
import { type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const searchParams = req.nextUrl.searchParams;
  const remoteUrl = searchParams.get("url") || "";
  console.log("remoteUrl", remoteUrl);

  const llm = new ChatMistralAI({
    streamUsage: false,
    verbose: false,
    model: "mistral-large-latest",
    temperature: 0,
  });

  const embeddings = new MistralAIEmbeddings({
    model: "mistral-embed",
  });

  const vectorStore = new MemoryVectorStore(embeddings);

  const cheerioLoader = new CheerioWebBaseLoader(remoteUrl, {
    selector: "p",
  });

  const docs = await cheerioLoader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunkDocuments = await splitter.splitDocuments(docs);

  await vectorStore.addDocuments(chunkDocuments);

  const template = `Use the following pieces of context to answer the question at the end.
    If you don't know the answer, just say that you couln't find the answer in the provided context. 
    Don't try to make enough information to answer, don't try to make up an answer.
    Use three sentences maximum and keep the answer as concise as possible.
    
    {context}
    
    Question: {question}
    
    Helpful Answer:`;

  const promptTemplateCustom = ChatPromptTemplate.fromMessages([
    ["user", template],
  ]);

  const relatedDocs = await vectorStore.similaritySearch(prompt);
  const docsContent = relatedDocs.map((doc) => doc.pageContent).join("\n");
  const ragResponse = await promptTemplateCustom.invoke({
    question: prompt,
    context: docsContent,
  });

  const stream = await llm.stream(ragResponse);
  return LangChainAdapter.toDataStreamResponse(stream);
}
