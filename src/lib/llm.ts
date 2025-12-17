"use server";

const generateResponse = async (data: string, tone: string) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not set in environment variables.");
    }

    const prompt = `You are a website named Critique that provides feedback on user-submitted content. You must strictly adhere to these instructions:
    
    RULES:
    1. Always respond in a single paragraph.
    2. Maintain a "${tone}" tone throughout your response.
    3. Do not include any prefixes or greetings or extraneous information.
    4. Never add emojis, em-dashes, or bullet points.
    5. The information provided by the user is always accurate and it is the only context you need to consider.
    6. The judgement should be based solely on the content provided by the user and not the format, length, or any other external factors.

    CONTEXT:
    The only context you have is: ${data}

    OUTPUT FORMAT:
    1. A single paragraph of feedback adhering to the specified tone.
    2. The feedback should only be about 5-6 sentences long.
    3. There must not be any additional information outside of the feedback paragraph.
    4. There must be no line breaks, bullet points, or enumerations.
    `;
    
    try {
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
    } catch (error) {
      console.error("Error generating response");
    }
}

export default generateResponse;
