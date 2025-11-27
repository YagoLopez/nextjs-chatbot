import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createPromptTemplate(
  userInput: string,
  mergedRelatedDocs: string,
  remoteUrl: string,
): string {
  return `Based on this question asked by the user: "${userInput}" and the current context: "${mergedRelatedDocs}" retrieved from the webpage: "${remoteUrl}",
  
    I want you to answer the user's question.
  
    If you don't know the answer, just say that you couldn't find any information related in the provided context. 
    Don't try to make enough information to answer, don't try to make up an answer.
    Keep the answer as concise as possible.`;
}

export const systemPrompt = `You are a helpful assistant. Answer the question asked by the user using as context the provided text retrieved from a web page`;

export const URLS = [
  "https://angularexperts.io/blog/advanced-typescript?ref=dailydev",
  "https://lilianweng.github.io/posts/2023-06-23-agent/",
  "https://blog.openreplay.com/top-four-ai-powered-ui-frameworks-for-2024/?ref=dailydev",
];
