"use server";

import generateReponse from "@/lib/llm";

const testConnection = async (data: string, type: string) => {
    const response = await generateReponse(data, type);
    return response;
}

export default testConnection;