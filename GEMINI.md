# Project Context: Next.js RAG AI Chatbot

## Project Overview
This project is a Next.js-based web application designed to allow users to interact with and ask questions about web page content using AI. It implements Retrieval Augmented Generation (RAG) to provide accurate, context-aware answers based on provided URLs.

## Tech Stack
*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, Radix UI (Primitives), Lucide React (Icons), `clsx`, `tailwind-merge`
*   **AI SDKs:**
    *   **Vercel AI SDK:** Core abstraction for streaming and model interaction.
    *   **LangChain:** Used for document loading, splitting, and vector storage in advanced RAG flows.
*   **AI Models:**
    *   **Google Gemini:** Used for generation (`gemini-2.5-flash`) and URL context analysis.
    *   **Mistral AI:** Used for embeddings (`mistral-embed`) and direct chat (`mistral-large-latest`).
*   **Tools:** ESLint, Prettier, Turbopack.

## Architecture & Key Features

The application exposes three distinct API routes demonstrating different AI capabilities:

1.  **Direct Chat (`/api/chat`)**
    *   Uses `mistral-large-latest`.
    *   Simple streaming chat interface without external context.

2.  **Native Tool RAG (`/api/rag`)**
    *   Uses `google("gemini-2.5-flash")`.
    *   Leverages the native `google.tools.urlContext` to let the model directly process the provided URL.
    *   Simpler implementation relying on the model provider's tool capabilities.

3.  **Custom RAG Pipeline (`/api/rag2`)**
    *   **Loader:** `CheerioWebBaseLoader` to scrape text from the target URL.
    *   **Splitter:** `RecursiveCharacterTextSplitter` to chunk content.
    *   **Embeddings:** `MistralAIEmbeddings` (`mistral-embed`).
    *   **Vector Store:** `MemoryVectorStore` (LangChain) for ephemeral storage of chunks.
    *   **Generation:** `google("gemini-2.5-flash")` generates the final answer based on retrieved context.

## Setup & Execution

### Prerequisites
*   Node.js (LTS recommended)
*   Package Manager: npm, yarn, pnpm, or bun

### Environment Variables
Create a `.env` file in the root directory (copy from `.env.template` if available) and configure:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
# Potentially MISTRAL_API_KEY if required by the Mistral SDK/LangChain integrations
```

### Commands
*   **Install Dependencies:** `npm install`
*   **Run Development Server:** `npm run dev` (Starts at http://localhost:3000)
*   **Build for Production:** `npm run build`
*   **Start Production Server:** `npm start`
*   **Linting:** `npm run lint`

## Project Structure

```
src/
├── app/
│   ├── api/                # Backend API Routes
│   │   ├── chat/           # Direct Mistral Chat
│   │   ├── rag/            # Google Tool-based RAG
│   │   └── rag2/           # LangChain Custom RAG
│   ├── page.tsx            # Main entry point
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles (Tailwind)
├── components/
│   ├── ui/                 # Reusable UI components (buttons, inputs, etc.)
│   └── slide.tsx           # Specific feature component
├── lib/
│   └── utils.ts            # Helper functions (likely for class merging, etc.)
```

## Conventions
*   **Imports:** Use the `@/` alias to import from the `src` directory (e.g., `import { cn } from "@/lib/utils"`).
*   **Components:** UI components are located in `src/components/ui`.
*   **API Routes:** Defined in `src/app/api/[route_name]/route.ts`.
