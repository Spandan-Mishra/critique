"use server";

export async function getTopArtists({ accessToken }: {accessToken: string}) {
    const res = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=5", {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    })

    return res.json();
}

export async function getTopTracks({ accessToken }: {accessToken: string}) {
    const res = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20", {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    })

    return res.json();
}