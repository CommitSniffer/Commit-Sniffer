import { GEMINI_MODEL } from "../const/const.js";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getResponse(prompt) {
    const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.candidates[0].content.parts[0].text;
}

export async function newChat(roleDefinition, maxOutputTokens = 2048) {
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ model: GEMINI_MODEL }).startChat({
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

export async function useChat(chat, prompt) {
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}

function extractComments(fileContent) {
    const commentRegex = /\/\*[\s\S]*?\*\/|\/\/.*/g;
    const comments = fileContent.match(commentRegex) || [];
    return comments;
}

function sanitizeJSONResult(response) {
    let result = response.replace("JSON", "");
    result = result.replace("json", "");
    result = result.replace("\n```", "");
    result = result.replace("```\n", "");
    return result;
}

export function checkCommentSmells(fileContent) {
    const role = "You are a code comment reviewer. I will provide you a data in the format: array[string] which is an array of strings of code comments and the full code of the file. You will review those comments as 'expressive', that is, the comment is a useful for a codebase they can be even oneline codes explaining a variable, all comments related to the code is expressive, or 'non-expressive', that is, the comment adds no significant value to the codebase, they are not related to code, can be commented code pieces or author/license info also. Your output will be in the form like a JSON compatible string, in the format: \"{indexOfTheComment: 1 for expressive, 0 for non-expressive}\"";
    const comments = extractComments(fileContent);
    if (comments.length > 0) {
        const prompt = `Comments: ${JSON.stringify(comments)}\nFull code: ${fileContent}`;
        const getChat = async () => {
            let chat = await newChat(role);
            let response = await useChat(chat, prompt);
            let cleanedResponse = sanitizeJSONResult(response);
            let expressiveIndices = JSON.parse(cleanedResponse);
            let notOkComments = [];
            Object.keys(expressiveIndices).forEach(index => {
                let i = parseInt(index);
                if (expressiveIndices[i] === 0) {
                    let notOkComment = comments[i];
                    notOkComments.push(`The comment is not expressive \`\`\`${notOkComment}\`\`\``);
                }
            });
            return notOkComments;
        }
        getChat();
    }
    return [];
}
