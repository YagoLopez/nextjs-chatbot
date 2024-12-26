import { streamText } from 'ai';
import { mistral } from '@ai-sdk/mistral';

export const maxDuration = 30;

export async function POST(req: Request) {
  const model = mistral('mistral-large-latest');
  const { messages } = await req.json();

  const result = streamText({
    model,
    messages,
  });

  return result.toDataStreamResponse();
}

