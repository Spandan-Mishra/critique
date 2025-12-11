"use server";

import { getUserGithubProfile } from "@/lib/github";
import generateResponse from "@/lib/llm";

export default async function analyzeGithub({ username, tone }:{username: string, tone: string}) {
    const { profile, repos } = await getUserGithubProfile({ username });

    if (!profile || !repos) {
        throw new Error("Failed to fetch GitHub data");
    }

    const data = `
        User: ${profile.login} (${profile.name})
        Bio: "${profile.bio}"
        Stats: ${profile.followers} followers, ${profile.following} following.
        Total Repos: ${profile.public_repos}.
        Account Age: Created in ${new Date(profile.created_at).getFullYear()}.

        Recent Repositories:

        ${repos.map((repo: any, index: number) => `${index + 1}. ${repo.name} (${repo.language || "N/A"}) - ${repo.stargazers_count} stars, ${repo.forks_count} forks. Description - ${repo.description || "N/A"}`).join("\n")}
    `

    const feedback = await generateResponse(data, tone);

    return feedback;
}