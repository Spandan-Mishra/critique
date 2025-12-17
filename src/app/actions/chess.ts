import { getChessStats } from "@/lib/chess";
import generateResponse from "@/lib/llm";

export async function analyzeChess({ username, tone }: { username: string; tone: string }) {
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
}