"use server";

import generateResponse from "@/lib/llm";
import { getTopAnime } from "@/lib/anime";
import { Tone } from "../page";

export default async function analyzeAnime({ username, tone }: { username: string, tone: Tone }) {
    const data = await getTopAnime({ username });

    if (!data) {
        throw new Error("Failed to fetch Anime data");
    }

    const animeTitles = data.map((anime: any) => anime.node.title).join(", ");

    const feedback = generateResponse(`list of top animes: ${animeTitles}`, tone)

    return feedback;
}