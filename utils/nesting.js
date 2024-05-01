export async function checkUnnecessaryNesting(fileContent, filePath) {
    // Prepare the prompt for the LLM
    const prompt = 
        `Take a deep breath and focus on the task.
        Review the following Java code from the file "${filePath}"
        for solely addressing potential improvements related to reducing nesting.
        ONLY focus on unnecessary nesting. ONLY provide the refactor suggestions. If you want to recommend changes to a certain part,
        first provide the original code like "Non-Complient Code: <original-code>" followed by "Complient Code: <your-changed-code>".
        Do not reply with greetings or other introductions like "Certainly, here is..." etc.
        For your recommendations, only show the specific code segment that you changed.
        If there are no suggestions from you, just reply with "NO".
        You don't have to recommend changes. ONLY recommend if your changes are reducing unnecessary nesting.
        Specify the old nesting level and new nesting level.
        Before showing your response, check if your recommendations reduce the nesting. If not, don't provide them as recommendations.
        It is crucial you follow the prompts extremely carefully. File contents:\n\n${fileContent}`;

    const response = "" // await llm.ask(prompt);

    if (response.trim().length > 0 && response.trim().toUpperCase() !== "NO") {
        return [`Refactor to remove unnecessary nesting in ${filePath}:\n\n${response}`];
    }
    else {
        return [];
    }
}
