"use server";

import { getTopArtists, getTopTracks } from "@/lib/spotify";
import { Tone } from "../page";
import generateResponse from "@/lib/llm";

export default async function analyzeSpotify({ accessToken, tone }:{accessToken: string, tone: Tone}) {
    const artistData = await getTopArtists({ accessToken });
    const trackData = await getTopTracks({ accessToken });

    if (!artistData || !artistData.items) {
        throw new Error("Failed to fetch Spotify data");
    }

    const artistNames = artistData.items.map((artist: any) => artist.name).join(", ");
    const trackNames = trackData.items.map((track: any) => track.name).join(", ");

    console.log("Artist Names:", artistNames);
    console.log("Track Names:", trackNames);

    const feedback = await generateResponse(`list of top artists: ${artistNames}, list of top tracks: ${trackNames}`, tone);

    return feedback;
}