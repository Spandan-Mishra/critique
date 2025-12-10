"use server";

import { getTopArtists } from "@/lib/spotify";
import { Tone } from "../page";
import generateResponse from "@/lib/llm";

export default async function analyzeSpotify({ accessToken, tone }:{accessToken: string, tone: Tone}) {
    const data = await getTopArtists({ accessToken });

    if (!data || !data.items) {
        throw new Error("Failed to fetch Spotify data");
    }

    const artistNames = data.items.map((artist: any) => artist.name).join(", ");
    
    const feedback = await generateResponse(`list of top artists: ${artistNames}`, tone);

    return feedback;
}