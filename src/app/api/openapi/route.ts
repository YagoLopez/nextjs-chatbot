import { NextResponse } from "next/server";

export async function GET() {
  // Vercel proporciona la variable VERCEL_URL en los despliegues, pero sin el protocolo.
  // En local, usamos localhost:3000.
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const host = process.env.VERCEL_URL || "localhost:3000";
  const serverUrl = `${protocol}://${host}`;

  const spec = {
    openapi: "3.0.0",
    info: {
      title: "Next.js RAG Chatbot API",
      version: "1.0.0",
      description:
        "API documentation for the Next.js RAG Chatbot application, featuring standard chat and Retrieval-Augmented Generation (RAG) endpoints.",
    },
    servers: [
      {
        url: serverUrl,
        description: process.env.VERCEL_URL
          ? "Production/Preview Server"
          : "Development Server",
      },
    ],
    paths: {
      "/api/chat": {
        post: {
          summary: "Direct Chat",
          description:
            "Stream a chat response using Mistral AI (mistral-large-latest).",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    messages: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          role: {
                            type: "string",
                            enum: ["user", "assistant", "system"],
                          },
                          content: {
                            type: "string",
                          },
                        },
                      },
                      description: "List of chat messages context.",
                    },
                  },
                  required: ["messages"],
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Successful streaming response.",
              content: {
                "text/plain": {
                  schema: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
      "/api/rag": {
        post: {
          summary: "Google Tool RAG",
          description:
            "RAG implementation using Google's native url_context tool and Gemini Flash.",
          parameters: [
            {
              in: "query",
              name: "url",
              schema: {
                type: "string",
              },
              description: "The URL to retrieve context from.",
              required: true,
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    prompt: {
                      type: "string",
                      description: "The user's question or prompt.",
                    },
                  },
                  required: ["prompt"],
                },
              },
            },
          },
          responses: {
            "200": {
              description:
                "Successful streaming response based on URL context.",
              content: {
                "text/plain": {
                  schema: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
      "/api/rag2": {
        post: {
          summary: "Custom LangChain RAG",
          description:
            "Advanced RAG pipeline using LangChain, Mistral Embeddings, and Cheerio for scraping.",
          parameters: [
            {
              in: "query",
              name: "url",
              schema: {
                type: "string",
              },
              description: "The URL to scrape and vectorize.",
              required: true,
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    prompt: {
                      type: "string",
                      description: "The user's question.",
                    },
                  },
                  required: ["prompt"],
                },
              },
            },
          },
          responses: {
            "200": {
              description:
                "Successful streaming response using custom RAG pipeline.",
              content: {
                "text/plain": {
                  schema: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(spec);
}
