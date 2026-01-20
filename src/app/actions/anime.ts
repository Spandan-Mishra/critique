"use server";

import generateResponse from "@/lib/llm";
import { getTopAnime } from "@/lib/anime";
import { Tone } from "../page";

export default async function analyzeAnime({ username, tone, username1, username2 }: { username?: string, tone?: Tone, username1?: string, username2?: string }) {
    if (username && tone) {
        const data = await getTopAnime({ username });

        if (!data) {
            throw new Error("Failed to fetch Anime data");
        }

        const animeTitles = data.map((anime: any) => anime.node.title).join(", ");

        const feedback = generateResponse(`list of top animes: ${animeTitles}`, tone)

        return feedback;
    } else if (username1 && username2) {
        const [data1, data2] = await Promise.all([
            getTopAnime({ username: username1 }),
            getTopAnime({ username: username2 })
        ])

        if (!data1 || !data2) {
            throw new Error("Failed to fetch Anime data for the users");
        }

        const animeTitles1 = data1.map((anime: any) => anime.node.title).join(", ");
        const animeTitles2 = data2.map((anime: any) => anime.node.title).join(", ");

        const feedback = generateResponse(`You are the judge of a social media battle for comparing two users' anime preferences.

            User 1's top animes: ${animeTitles1}
            User 2's top animes: ${animeTitles2}

            Provide a comparative analysis of their anime preferences, judge which user has better taste in anime, and declare a definitive winner between the two users.
            Roast the user that loses the battle based on their taste in anime.
            `,
        "roast");    
        
        return feedback;
    }
}