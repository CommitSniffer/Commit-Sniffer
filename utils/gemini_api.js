import { CONFIG } from "../const/config.js";
import { ENV } from "../const/env.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

function getModel(model = CONFIG.GEMINI_MODEL) {
    return new GoogleGenerativeAI(ENV.GEMINI_API_KEY).getGenerativeModel({
        model: model,
    });
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
                parts: [
                    {
                        text: "Okay, I am waiting for the data you will provide. I will response only as you define.",
                    },
                ],
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
    const model = await getModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.candidates[0].content.parts[0].text;
}

function sanitizeJSONResult(response) {
    let result = response.replace("JSON", "");
    result = result.replace("json", "");
    result = result.replace("\n```", "");
    result = result.replace("```\n", "");
    return result;
}

export { multiPromptChat, useMultiPromptChat, getResponse, sanitizeJSONResult };
