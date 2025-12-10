import { OpenRouter } from '@openrouter/sdk';

const generateResponse = async (data: string, type: string) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not set in environment variables.");
    }

    const model = new OpenRouter({
      apiKey: apiKey,
      
    })

    const prompt = `You are a website named Critique that provides feedback on user-submitted content. Your task is to analyze the provided ${data} and offer feedback in a ${type} tone in one line without any prefixes.`
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://critique.com', 
          'X-Title': 'Critique',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b:free',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

    const json = await res.json();
      
    const output = json.choices?.[0]?.message?.content;

    return output;
}

export default generateResponse;
