"use server";

export async function getTopAnime({ username }: { username: string }) {
    try {
        const res = await fetch(`https://api.myanimelist.net/v2/users/${username}/animelist?status=completed&sort=list_score&limit=20`, {
            headers: {
                "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID!
            }
        })
        const data = await res.json()
        console.log("Data from lib:", data.data);
        return data.data;
    } catch(error) {
        console.error("Error fetching data from MAL:", error);
    }
}
