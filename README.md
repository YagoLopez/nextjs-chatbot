## RAG with web pages. By Yago López

- This proof of concept allows to make questions about the contents of a web page and get answers
- It uses **RAG**: Retrieval Augmented Generation
  - In-memory Vector Database
  - Mistral Embeddings: to create vectorial representations of unstructured information (text)
  - Similarity Search
  - Mistral LLM

- The user can provide the URL to the web page
- The answer is scoped to the web page text. . If the question is not related to the web page the AI will not be able to provide a response. This avoid hallucinations that happen with general chat bots

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
- Select or Add a URL in the input text box
- Type a question about the text of the web page in the input text box
- Submit the question

## Technical Stack

- LLM: Mistral AI
- AI Frameworks:
  - Vercel AI SDK
  - LangChain
- Frontend Framework: NextJS
- UI Library: Shadcdn
- Typescript

## Environment Variables Needed

```text
MISTRAL_API_KEY=
LANGCHAIN_TRACING_V2="true"
LANGCHAIN_API_KEY=
```

(Not provided in the project)
