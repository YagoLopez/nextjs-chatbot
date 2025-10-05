import { mistral } from "@ai-sdk/mistral";
import { streamText } from "ai";

export const maxDuration = 60;

export async function POST() {
  const result = streamText({
    model: mistral("mistral-large-latest"),
    prompt: "Esto es una prueba",
  });

  return result.toUIMessageStreamResponse();
}
