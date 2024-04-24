import { MAX_FCN_LENGTH } from "../const/const.js";

const javaCode = `
public class Example {
    public void method1() {
        // Code here
    }

    private int method2(int param) {
        // Code here
        return param * 2;

        for (var) {
          int++;
        }
    }

    protected void method3() {
        // Code here


    }
}`;

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

export function getMethodLengths(text = javaCode) {
    // Split the Java code into individual methods

    const methods = text.match(
        /(public|private|protected)\s+\w+\s+\w+\([^)]*\)\s*\{[^{}]*\}/g
    );

    if (!methods) {
        console.log("No methods found in the provided Java code.");
        return;
    }

    const methodLengths = methods.map((method) => {
        const methodNameMatch = method.match(
            /(public|private|protected)\s+\w+\s+(\w+)\([^)]*\)\s*\{/
        );
        const methodName = methodNameMatch[2];

        // Count the number of lines in each method
        const lines = method.split("\n");
        // .filter((line) => line.trim() !== "");

        const length = lines.length;

        // Log method name and length
        console.log(`Method: ${methodName}, Length: ${length}`);
        console.log(lines);
        console.log("--------");

        return { methodName, length };
    });

    console.log(methodLengths);
    return methodLengths;
}
