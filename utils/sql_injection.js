export async function checkUnnecessaryNesting(fileContent, filePath) {
  // Prepare the prompt for the LLM
  const prompt = 
      `Take a deep breath and focus on the task.
      Review the following Java code from the file "${filePath}"
      for solely addressing potential improvements related to SQL injection vulnerabilities.
      ONLY focus on SQL injection vulnerabilities. ONLY provide potential dangers. If you see any vulnerable code,
      first provide the original code like "Vulnerable Code: <original-code>" followed by "Safe Code: <your-changed-code>".
      Do not reply with greetings or other introductions like "Certainly, here is..." etc.
      For your recommendations, only show the specific code segment that you changed.
      If you see no vulnerabilities, just reply with "NO".
      It is crucial you follow the prompts extremely carefully. File contents:\n\n${fileContent}`;

  const response = "" // await llm.ask(prompt);

  if (response.trim().length > 0 && response.trim().toUpperCase() !== "NO") {
      return [`Potential SQL injection vulnerability in ${filePath}:\n\n${response}`];
  }
  else {
      return [];
  }
}
