"use server";

import { getUserGithubProfile } from "@/lib/github";
import generateResponse from "@/lib/llm";

export default async function analyzeGithub({ username, tone, username1, username2 }:{ username?: string, tone?: string, username1?: string, username2?: string }) {
    if (username && tone ) {
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
    } else if (username1 && username2) {
        const [user1Data, user2Data] = await Promise.all([
            getUserGithubProfile({ username: username1 }),
            getUserGithubProfile({ username: username2 })
        ]);

        if (!user1Data.profile || !user1Data.repos || !user2Data.profile || !user2Data.repos) {
            throw new Error("Failed to fetch GitHub data for the users");
        }

        const formatUserData = (profile: any, repos: any[]) => `
            User: ${profile.login} (${profile.name})
            Bio: "${profile.bio}"
            Stats: ${profile.followers} followers, ${profile.following} following.
            Total Repos: ${profile.public_repos}.
            Account Age: Created in ${new Date(profile.created_at).getFullYear()}.

            Recent Repositories:

            ${repos.map((repo: any, index: number) => `${index + 1}. ${repo.name} (${repo.language || "N/A"}) - ${repo.stargazers_count} stars, ${repo.forks_count} forks. Description - ${repo.description || "N/A"}`).join("\n")}
        `;

        const user1Formatted = formatUserData(user1Data.profile, user1Data.repos);
        const user2Formatted = formatUserData(user2Data.profile, user2Data.repos);

        const feedback = await generateResponse(`You are the judge of a social media battle for comparing two users' GitHub profiles.

            User 1's profile:
            ${user1Formatted}

            User 2's profile:
            ${user2Formatted}

            Provide a comparative analysis of their GitHub profiles, judge which user has a more impressive profile, and declare a definitive winner between the two users.
            Roast the user that loses the battle based on their GitHub profile.
            `,
        "roast");    
        
        return feedback;
    }
}