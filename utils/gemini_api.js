import { GEMINI_MODEL } from "../const/const.js";

import { GoogleGenerativeAI } from "@google/generative-ai";

function getModel(model = GEMINI_MODEL) {
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ model: model });
}

async function multiPromptChat(roleDefinition, maxOutputTokens = 2048) {
    return getModel().startChat({
        history: [
            {
                role: "user",
                parts: [{ text: roleDefinition }],
            },
            {
                role: "model",
                parts: [{ text: "Okay, I am waiting for the data you will provide. I will response only as you define." }],
            },
        ],
        generationConfig: {
            maxOutputTokens: maxOutputTokens,
        },
    });
}

async function useMultiPromptChat(chat, prompt) {
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}

async function getResponse(prompt) {
    const result = await getModel().generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text
}

function sanitizeJSONResult(response) {
    let result = response.replace("JSON", "");
    result = result.replace("json", "");
    result = result.replace("\n```", "");
    result = result.replace("```\n", "");
    return result;
}

export { multiPromptChat, useMultiPromptChat, getResponse, sanitizeJSONResult }