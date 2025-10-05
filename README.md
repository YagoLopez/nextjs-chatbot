## Chat with web pages. By Yago López

This README.md describes a web application that helps users ask questions about web pages using AI technology.

Purpose: The application lets users input a web page URL and then ask questions about the content of that webpage. It's like having a smart assistant that can read and understand any webpage you give it, then answer your questions about it.

- **Inputs**:
  - A URL to any web page you want to ask questions about
  - Questions typed by the user about the webpage's content
- **Outputs**: 
  - The system provides answers to your questions, but only based on the information found in the webpage you provided. This means it won't make up information or give answers about topics not covered in the webpage. (No hallucinations)

## Demo

- https://nextjs-chatbot-rl1m-g4qi2qh8t-yago-lopezs-projects.vercel.app/

## Performance Audit

- https://nextjs-chatbot-topaz.vercel.app/lighthouse.html

## Architecture

The application uses several smart technologies working together:

- It uses **RAG** (Retrieval Augmented Generation) which is like a smart search system
- It stores webpage information in a special database (Vector Database)
- It uses **Mistral AI** LLM to understand both the webpage content and your questions
- It matches your questions with the most relevant parts of the webpage to give accurate answers

## Installation

- Install dependencies using npm, yarn, pnpm, or bun
- Rename the file `.env.template` to `.env` and set up the following environment variables:  `MISTRAL_API_KEY`, `LANGCHAIN_API_KEY`. To get this keys you must sing-up to Mistral and LangChain websites

## Execution

- Start the application using a development server with the run dev script. For example: `npm run dev`
- Open it in a web browser at http://localhost:3000
- Input a webpage URL or choose one from the select box 
- Ask questions about the webpage
- Receive answers based on the webpage content

The application is built using modern web technologies like **NextJS** for the website structure, **Typescript** for coding, and special AI tools like **LangChainJS** and **Vercel AI SDK** as AI Frameworks. It's designed to be user-friendly while providing accurate, webpage-specific answers to user questions.