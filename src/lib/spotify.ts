"use server";

export async function getUserSpotifyData({ accessToken }: {accessToken: string}) {
    const [artists, tracks] = await Promise.all([
        async () => {
            const artists = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=5", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            })

            return artists.json();
        },
        async () => {
            const tracks = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            })

            return tracks.json();
        }
    ])

    return { artists: await artists(), tracks: await tracks() }
}