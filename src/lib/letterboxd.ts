"use server";

import Parser from "rss-parser";

export async function getLetterboxdData({ username }: { username: string }) {
    const parser = new Parser();
    const feed = await parser.parseURL(`https://letterboxd.com/${username}/rss/`);

    return feed.items;
}