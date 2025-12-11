"use server";

import { getUserSpotifyData } from "@/lib/spotify";
import { Tone } from "../page";
import generateResponse from "@/lib/llm";

export default async function analyzeSpotify({ accessToken, tone }:{accessToken: string, tone: Tone}) {
    const { artists, tracks } = await getUserSpotifyData({ accessToken: accessToken });

    if (!artists || !artists.items || !tracks || !tracks.items) {
        throw new Error("Failed to fetch Spotify data");
    }

    const artistNames = artists.items.map((artist: any) => artist.name).join(", ");
    const trackNames = tracks.items.map((track: any) => track.name).join(", ");

    const feedback = await generateResponse(`list of top artists: ${artistNames}, list of top tracks: ${trackNames}`, tone);

    return feedback;
}