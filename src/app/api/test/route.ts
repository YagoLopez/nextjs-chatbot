import { ChatMistralAI } from "@langchain/mistralai";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";
import { Annotation } from "@langchain/langgraph";
import { StateGraph } from "@langchain/langgraph";
import { NextResponse } from "next/server";

export async function GET() {
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

  const cheerioLoader = new CheerioWebBaseLoader(
    "https://lilianweng.github.io/posts/2023-06-23-agent/",
    {
      selector: "p",
    },
  );

  const docs = await cheerioLoader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunkDocuments = await splitter.splitDocuments(docs);

  await vectorStore.addDocuments(chunkDocuments);

  const template = `Use the following pieces of context to answer the question at the end.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    Use three sentences maximum and keep the answer as concise as possible.
    
    {context}
    
    Question: {question}
    
    Helpful Answer:`;

  const promptTemplateCustom = ChatPromptTemplate.fromMessages([
    ["user", template],
  ]);

  // const promptTemplate = await pull<ChatPromptTemplate>("rlm/rag-prompt");

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const InputStateAnnotation = Annotation.Root({
    question: Annotation<string>,
  });

  const StateAnnotation = Annotation.Root({
    question: Annotation<string>,
    context: Annotation<Document[]>,
    answer: Annotation<string>,
  });

  const retrieve = async (state: typeof InputStateAnnotation.State) => {
    const retrievedDocs = await vectorStore.similaritySearch(state.question);
    return { context: retrievedDocs };
  };

  const generate = async (state: typeof StateAnnotation.State) => {
    const docsContent = state.context.map((doc) => doc.pageContent).join("\n");
    const messages = await promptTemplateCustom.invoke({
      question: state.question,
      context: docsContent,
    });
    const response = await llm.invoke(messages);
    return { answer: response.content };
  };

  const graph = new StateGraph(StateAnnotation)
    .addNode("retrieve", retrieve)
    .addNode("generate", generate)
    .addEdge("__start__", "retrieve")
    .addEdge("retrieve", "generate")
    .addEdge("generate", "__end__")
    .compile();

  const inputs = { question: "Make a sumary of this blog post" };

  const result = await graph.invoke(inputs);

  // const stream = await graph.stream(inputs, { streamMode: "messages" });
  //
  // for await (const [message, _metadata] of stream) {
  //   process.stdout.write(message.content + "|");
  // }

  return NextResponse.json(result);
}
