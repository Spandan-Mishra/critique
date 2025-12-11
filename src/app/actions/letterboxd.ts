"use server";

import { getLetterboxdData } from "@/lib/letterboxd";
import { Tone } from "../page";
import { generateKey } from "crypto";
import generateResponse from "@/lib/llm";

export default async function analyzeLetterboxd({ username, tone }: { username: string, tone: Tone }) {
    const items = await getLetterboxdData({ username });

    if (!items) {
        throw new Error("Failed to fetch Letterboxd data");
    }

    const data = items.map((item, index) => {
        const hasReview = !item.contentSnippet?.startsWith("Watched on");

        return `${index + 1}. Movie: ${item.title}
            ${hasReview ? `User's Review Snippet: "${item.contentSnippet}"` : "No review provided."}
            Date: ${item.isoDate?.split("T")[0]}
        `
    }).join("\n");

    const feedback = generateResponse(data, tone);

    return feedback;
}