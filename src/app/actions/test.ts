"use server";

import generateReponse from "@/lib/llm";

const testConnection = async (data: string, type: string) => {
    try {
        const response = await generateReponse(data, type);
        return response;
    } catch (error) {
        console.error(error);
    }

}

export default testConnection;