import { MemoryVectorStore } from "langchain/vectorstores/memory";
import {MistralAIEmbeddings} from "@langchain/mistralai";
import type { Document } from "@langchain/core/documents";

export async function GET() {
  const embeddings = new MistralAIEmbeddings({
    model: "mistral-embed"
  });

  const vectorStore = new MemoryVectorStore(embeddings);

  const document1: Document = {
    pageContent: "The powerhouse of the cell is the mitochondria",
    metadata: { source: "https://example.com" },
  };

  const document2: Document = {
    pageContent: "Buildings are made out of brick",
    metadata: { source: "https://example.com" },
  };

  const document3: Document = {
    pageContent: "Mitochondria are made out of lipids",
    metadata: { source: "https://example.com" },
  };

  const documents = [document1, document2, document3];

  await vectorStore.addDocuments(documents);


  const filter = (doc) => doc.metadata.source === "https://example.com";

  const similaritySearchResults = await vectorStore.similaritySearch(
    "biology",
    2,
    filter
  );

  for (const doc of similaritySearchResults) {
    console.log(`* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]`);
  }

  return new Response(JSON.stringify(similaritySearchResults));
}