import { getResponse } from "./gemini_api.js";

export async function checkSqlInjection(fileContent, filePath) {
  // Prepare the prompt for the LLM
  const prompt = 
      `Take a deep breath and focus on the task.
      Review the following Java code from the file "${filePath}"
      for solely addressing potential improvements related to SQL injection vulnerabilities.
      ONLY focus on SQL injection vulnerabilities. ONLY provide potential dangers.
      If you see any vulnerabilities, just reply with "YES".
      If you see no vulnerabilities, just reply with "NO".
      It is crucial you follow the prompts extremely carefully. File contents:\n\n${fileContent}`;

  const response = await getResponse(prompt);

  if (response.trim().length > 0 && response.trim().toUpperCase() !== "NO") {
      return [`Potential SQL injection vulnerability in \`${filePath}\``];
  }
  else {
      return [];
  }
}
