import { ChatMistralAI } from "@langchain/mistralai";
import { LangChainAdapter } from "ai";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const llm = new ChatMistralAI({
    streamUsage: false,
    verbose: false,
    model: "mistral-large-latest",
    temperature: 0,
  });

  const stream = await llm.stream(prompt);

  return LangChainAdapter.toDataStreamResponse(stream);
}
