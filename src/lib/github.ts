"use server";

export async function getUserGithubProfile({ username }: { username: string }) {
    const [profile, repos] = await Promise.all([
        async () => {
            const profile = await fetch(`https://api.github.com/users/${username}`, {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
                }
            })
            return profile.json()
        },
        async () => {
            const repos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=15`, {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
                }
            })
            return repos.json()
        }
    ])

    return { profile: await profile(), repos: await repos() }
}