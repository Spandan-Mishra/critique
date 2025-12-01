import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const llm = new GoogleGenerativeAI(apiKey);

const model = llm.getGenerativeModel({model: "gemini-2.5-flash"});

const generateResponse = async (data: string, type: string) => {
    const prompt = `You are a website named Critique that provides feedback on user-submitted content. Your task is to analyze the provided ${data} and offer feedback in a ${type} tone in one line without any prefixes.`

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

export default generateResponse;
