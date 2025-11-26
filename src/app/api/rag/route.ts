import { type NextRequest } from "next/server";
import { google } from "@ai-sdk/google";
import { streamText, Tool } from "ai";

export const runtime = "edge";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { prompt: userInput } = await req.json();

  const remoteUrl = req.nextUrl.searchParams.get("url") || "";

  const prompt = `Given this url: ${remoteUrl} and this user question: ${userInput}, I want you to give me a response based on the content of the URL. The response should be brief and concise.\n\n    If you don't know the answer or cannot find the information in the provided URL, state that you could not find the relevant information in the provided context. Do not make up an answer.`;

  const result = streamText({
    model: google("gemini-2.5-flash"),
    prompt,
    tools: {
      url_context: google.tools.urlContext({}) as Tool<unknown, unknown>,
    },
  });

  return result.toUIMessageStreamResponse();
}
