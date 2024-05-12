import { getResponse } from "./gemini_api.js";

export async function checkCodeShortening(fileContent, filePath) {
    // Prepare the prompt for the LLM
    const prompt1 = 
        `Take a deep breath and focus on the task.
        Review the following Java code from the file "${filePath}"
        for solely addressing potential code shortening improvements. For instance, if the code has "if (var == true)", you will recommend to change "if (var)".
        ONLY focus on code shortening. ONLY provide the refactor suggestions. If you want to recommend changes to a certain part,
        first provide the original code like "Non-Complient Code:" followed by the following in a new line
        "\`\`\`java\n<original-code>\`\`\`" followed by "Complient Code:" followed by in a new line: "\`\`\`java\n<your-changed-code>\`\`\`".
        Do not reply with greetings or other introductions like "Certainly, here is..." etc.
        For your recommendations, only show the specific code segment that you changed.
        If there are no suggestions from you, just reply with "NO".
        You don't have to recommend changes. ONLY recommend if your changes are shortening the code while preserving functionality.
        Before showing your response, check if your recommendations actually shorten the code while preserving functionality. If not, don't provide them as recommendations.
        Make sure that the recommendations you provide do NOT change the original functionality, this is extremely important. You can provide as many recommendations as you wish.
        It is crucial you follow the prompts extremely carefully. File contents:\n\n${fileContent}`;
        
    const response = await getResponse(prompt1);

    if (response.trim().length > 0 && response.trim().toUpperCase() !== "NO") {
        return [`Refactor to shorten code in \`${filePath}\`:\n\n${response}`];
    }
    else {
        return [];
    }
}
