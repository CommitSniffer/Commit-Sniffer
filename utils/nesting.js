import { getResponse } from "./gemini_api.js";

export async function checkUnnecessaryNesting(fileContent, filePath) {
    // Prepare the prompt for the LLM
    const prompt1 = 
        `Take a deep breath and focus on the task.
        Review the following Java code from the file "${filePath}"
        for solely addressing potential improvements related to reducing nesting. Make sure the code you select certainly has unnecessary nesting.
        ONLY focus on unnecessary nesting. ONLY provide the refactor suggestions. If you want to recommend changes to a certain part,
        first provide the original code like "Non-Complient Code:" followed by the following in a new line
        "\`\`\`java\n<original-code>\`\`\`" followed by "Complient Code:" followed by in a new line: "\`\`\`java\n<your-changed-code>\`\`\`".
        Do not reply with greetings or other introductions like "Certainly, here is..." etc.
        For your recommendations, only show the specific code segment that you changed.
        If there are no suggestions from you, just reply with "NO".
        You don't have to recommend changes. ONLY recommend if your changes are reducing unnecessary nesting.
        Before showing your response, check if your recommendations reduce the nesting. If not, don't provide them as recommendations.
        Make sure that the recommendations you provide do NOT change the original functionality, this is extremely important.
        It is crucial you follow the prompts extremely carefully. File contents:\n\n${fileContent}`;

    const prompt2 = `Review the Java code from the file "${filePath}" focusing exclusively on reducing unnecessary nesting. For any proposed changes, present the original code under "Non-Compliant Code:" followed by:
    \`\`\`java
    <original-code>
    \`\`\`
    Then, show your refactor under "Compliant Code:" with:
    \`\`\`java
    <your-changed-code>
    \`\`\`
    Limit your response to the specific code segments with nesting issues. If no changes are needed, reply with "NO". Ensure your suggestions do not alter the original code's functionality and strictly adhere to reducing nesting.`
    
    const response = await getResponse(prompt2);

    console.log("response");
    console.log("response");
    console.log("response");
    console.log(response);
    console.log("response");
    console.log("response");
    console.log("response");

    if (response.trim().length > 0 && response.trim().toUpperCase() !== "NO") {
        return [`Refactor to remove unnecessary nesting in \`${filePath}\`:\n\n${response}`];
    }
    else {
        return [];
    }
}
