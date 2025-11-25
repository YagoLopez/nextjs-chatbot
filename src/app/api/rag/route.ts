import { type NextRequest } from "next/server";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "edge";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { prompt: userInput } = await req.json();

  const remoteUrl = req.nextUrl.searchParams.get("url") || "";

  const prompt = `Given this url: ${remoteUrl} and this request ${userInput} formulated by the user 
    I want you to give me a response to the user request. The response should be brief and concise`;

  // const { text, sources, providerMetadata } = streamText({
  const result = streamText({
    model: google("gemini-2.5-flash"),
    prompt,
    tools: {
      url_context: google.tools.urlContext({}),
    },
  });

  return result.toUIMessageStreamResponse();
}
