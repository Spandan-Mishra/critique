import { getChessStats } from "@/lib/chess";
import generateResponse from "@/lib/llm";

export async function analyzeChess({ username, tone, username1, username2 }: { username?: string; tone?: string; username1?: string; username2?: string }) {
  if (username && tone) {
    const { profile, stats } = await getChessStats({ username });

    const formatMode = (name: string, data: any) => {
      if (!data) return null;
      const total = data.record.win + data.record.loss + data.record.draw;
      return `${name}: Rating ${data.last.rating} (Best: ${data.best.rating}). Record: ${data.record.win}W - ${data.record.loss}L - ${data.record.draw}D.`;
    };

    const rapid = formatMode("Rapid", stats.chess_rapid);
    const blitz = formatMode("Blitz", stats.chess_blitz);
    const bullet = formatMode("Bullet", stats.chess_bullet);

    const prompt = `
      Analyze this Chess.com player.
      User: ${profile.username} (Country: ${profile.country?.split('/').pop() || 'Unknown'}).
      
      Stats:
      ${rapid || "No Rapid games played."}
      ${blitz || "No Blitz games played."}
      ${bullet || "No Bullet games played."}
    `;

    const feedback = await generateResponse(prompt, tone);

    return feedback;
  } else if (username1 && username2) {
    const [user1Data, user2Data] = await Promise.all([
      getChessStats({ username: username1 }),
      getChessStats({ username: username2 }),
    ]);

    const formatUserData = (profile: any, stats: any) => {
      const formatMode = (name: string, data: any) => {
        if (!data) return null;
        const total = data.record.win + data.record.loss + data.record.draw;
        return `${name}: Rating ${data.last.rating} (Best: ${data.best.rating}). Record: ${data.record.win}W - ${data.record.loss}L - ${data.record.draw}D.`;
      };

      const rapid = formatMode("Rapid", stats.chess_rapid);
      const blitz = formatMode("Blitz", stats.chess_blitz);
      const bullet = formatMode("Bullet", stats.chess_bullet);

      return `
        User: ${profile.username} (Country: ${profile.country?.split('/').pop() || 'Unknown'}).
        
        Stats:
        ${rapid || "No Rapid games played."}
        ${blitz || "No Blitz games played."}
        ${bullet || "No Bullet games played."}
      `;
    };

    const user1Formatted = formatUserData(user1Data.profile, user1Data.stats);
    const user2Formatted = formatUserData(user2Data.profile, user2Data.stats);

    const feedback = await generateResponse(`You are the judge of a social media battle for comparing two users' Chess.com profiles.

      User 1's profile:
      ${user1Formatted}

      User 2's profile:
      ${user2Formatted}

      Provide a comparative analysis of their chess skills and preferences, judge which user is the stronger player, and declare a definitive winner between the two users.
      Roast the user that loses the battle based on their chess abilities.
      `,
    "roast");

    return feedback;
  }
}