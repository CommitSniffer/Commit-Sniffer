import { multiPromptChat, useMultiPromptChat, sanitizeJSONResult } from "./gemini_api.js";

function extractComments(fileContent) {
    const commentRegex = /\/\*[\s\S]*?\*\/|\/\/.*/g;
    const comments = fileContent.match(commentRegex) || [];
    return comments;
}

export async function checkCommentSmells(fileContent, filePath) {
    const role = "You are a code comment reviewer. I will provide you a data in the format: array[string] which is an array of strings of code comments and the full code of the file. You will review those comments as 'expressive', that is, the comment is a useful for a codebase they can be even oneline codes explaining a variable, all comments related to the code is expressive, or 'non-expressive', that is, the comment adds no significant value to the codebase, they are not related to code, can be commented code pieces or author/license info also. Your output will be in the form like a JSON compatible string, in the format: \"{indexOfTheComment: 1 for expressive, 0 for non-expressive}\"";
    const comments = extractComments(fileContent);
    if (comments.length > 0) {
        const prompt = `Comments: ${JSON.stringify(comments)}\nFull code: ${fileContent}`;
        try {
            let chat = await multiPromptChat(role);
            let response = await useMultiPromptChat(chat, prompt);
            let cleanedResponse = sanitizeJSONResult(response);
            let expressiveIndices = JSON.parse(cleanedResponse);
            let notOkComments = [];
            Object.keys(expressiveIndices).forEach(index => {
                let i = parseInt(index);
                if (expressiveIndices[i] === 0) {
                    let notOkComment = comments[i];
                    let line = fileContent.substring(0, fileContent.indexOf(notOkComment)).split("\n").length;
                    if (notOkComment.includes("\n"))
                        notOkComments.push(`On \`line ${line}\`:\n\`\`\`\n${notOkComment}\n\`\`\``);
                    else
                        notOkComments.push(`\`${notOkComment}\` on \`line ${line}\``);
                }
            });
            return [`Non-expressive comments in file \`${filePath}\`\n` + notOkComments.join("\n")];
        }
        catch {
            console.error("Error while comment smell analysis!")
        }
    }
    return [];
}
