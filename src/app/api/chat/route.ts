import { streamText } from 'ai';
import { mistral } from '@ai-sdk/mistral';

export const maxDuration = 30;

export async function POST(req: Request) {
  const model = mistral('mistral-large-latest');
  const { messages } = await req.json();

  console.log('api key', process.env.MISTRAL_API_KEY);

  const result = streamText({
    model,
    messages,
  });

  return result.toDataStreamResponse();
}

