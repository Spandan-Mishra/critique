"use server";

import { getLetterboxdData } from "@/lib/letterboxd";
import { Tone } from "../page";
import { generateKey } from "crypto";
import generateResponse from "@/lib/llm";

export default async function analyzeLetterboxd({ username, tone, username1, username2 }: { username?: string, tone?: Tone, username1?: string, username2?: string }) {
    if (username && tone) {
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
    } else if (username1 && username2) {
        const [items1, items2] = await Promise.all([
            getLetterboxdData({ username: username1 }),
            getLetterboxdData({ username: username2 })
        ]);

        if (!items1 || !items2) {
            throw new Error("Failed to fetch Letterboxd data for the users");
        }

        const formatUserData = (items: any[], username: string) => {
            return items.map((item, index) => {
                const hasReview = !item.contentSnippet?.startsWith("Watched on");

                return `${index + 1}. Movie: ${item.title}
                    ${hasReview ? `User's Review Snippet: "${item.contentSnippet}"` : "No review provided."}
                    Date: ${item.isoDate?.split("T")[0]}
                `
            }).join("\n");
        };

        const user1Formatted = formatUserData(items1, username1);
        const user2Formatted = formatUserData(items2, username2);

        const feedback = generateResponse(`You are the judge of a social media battle for comparing two users' Letterboxd profiles.

            User 1's profile:
            ${user1Formatted}

            User 2's profile:
            ${user2Formatted}

            Provide a comparative analysis of their movie reviews and preferences, judge which user has better taste in movies, and declare a definitive winner between the two users.
            Roast the user that loses the battle based on their taste in movies.
            `,
        "roast");    
        
        return feedback;
    }
}