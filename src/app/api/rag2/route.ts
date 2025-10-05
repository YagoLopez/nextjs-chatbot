import { mistral } from "@ai-sdk/mistral";
import { streamText } from "ai";

export const maxDuration = 60;

export async function POST() {
  const result = streamText({
    model: mistral("mistral-large-latest"),
    prompt: "Write a poem about embedding models.",
  });

  return result.toDataStreamResponse();
}
