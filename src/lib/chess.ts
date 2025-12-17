
export async function getChessStats({ username }: { username: string }) {
    const profileRes = await fetch(`https://api.chess.com/pub/player/${username}`);

    if (!profileRes.ok) {
        throw new Error(`Failed to fetch profile for user: ${username}`);
    }

    const profile = await profileRes.json();

    const statsRes = await fetch(`https://api.chess.com/pub/player/${username}/stats`);

    if (!statsRes.ok) {
        throw new Error(`Failed to fetch stats for user: ${username}`);
    }

    const stats = await statsRes.json();

    return {
        profile,
        stats
    };
}