import { MAX_FCN_LENGTH } from "../const/const.js";

const text = `
function example() {
  // Method content
  for (let i = 0; i < 5; i++) {
    // Inside loop
  }
  if (true) {
    // Inside conditional
  }
}

const anotherMethod = () => {
  // Another method content
  while (true) {
    // Inside another loop
  }
};
`;

const methodRegex =
    /function\s*(\w*)\s*\([^)]*\)\s*\{([\s\S]*?)\}|(\((\w*)\)\s*=>\s*\{([\s\S]*?)\})/g;
const lineRegex = /\r?\n/g;

export function checkMaxMethodLength(
    commit = text,
    maxLength = MAX_FCN_LENGTH
) {
    let match;
    while ((match = methodRegex.exec(text)) !== null) {
        const methodName = match[1] || match[4]; // For regular functions or arrow functions
        const methodContent = match[2] || match[5]; // For regular functions or arrow functions

        // Find the index of the opening brace of the method
        const openingBraceIndex = match.index + match[0].indexOf("{") + 1;

        // Calculate the length of the method content by finding the matching closing brace
        let closingBraceIndex = openingBraceIndex;
        let braceCount = 1;
        while (braceCount > 0 && closingBraceIndex < text.length) {
            const char = text[closingBraceIndex++];
            if (char === "{") {
                braceCount++;
            } else if (char === "}") {
                braceCount--;
            }
        }
        const methodLength = closingBraceIndex - openingBraceIndex - 1; // Subtract 1 to exclude the closing brace

        // Split method content into lines and log each line
        const lines = methodContent.split("\n");
        console.log(`Method: ${methodName}, Length: ${methodLength}`);
        console.log("Method content:");
        lines.forEach((line, index) => console.log(`${index + 1}: ${line}`));
        console.log("--------------------------");
    }
}
