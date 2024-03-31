import { MAX_FCN_LENGTH } from "../const/const.js";
import { Stack } from "./stack.js";
const javaCode = `
public class Example {
    public void method1() {
        // Code here

        for (var) {
            var++;
            if (amogus) {
                amogus
            }

            do {
                aa++
            } while (false)
        }
    }

    private int method2(int param)


    {
        /*
        hola
        come
        estas
        */
        // Code here
        return param * 2;
    }

    protected void method3() { int++;
        // Code here
        /**  
        * 
        *We can use various tags to depict the parameter 
        *or heading or author name 
        *We can also use HTML tags   
        * 
        */    
    int = 1}

    protected void method4() { }
    protected void method5() { 

    }
}`;

export function checkMethodLengths(fileContent = javaCode) {
    let result = getMethodLengths(fileContent);
    const msg = [];

    // if a method has an excessive length, find its starting line
    result.forEach((method) => {
        if (method.length > MAX_FCN_LENGTH) {
            msg.push(
                `Method ${method.methodSign} starting at line ${findMethodLine(
                    fileContent,
                    method.methodSign
                )} exceeds max method legth constraint since its length is ${
                    method.length
                }`
            );
        }
    });

    return msg;
}

function findMethodLine(file, methodSign) {
    return file
        .split("\n")
        .map((line, index) => ({ line: index + 1, content: line }))
        .filter(({ content }) => content.includes(methodSign))
        .map(({ line }) => line);
}

function getMethodLengths(fileContent = javaCode) {
    // TODO what if there are new lines between method tokens

    // Create a stack to match opening and closing braces
    const stack = new Stack();
    const methodStartRegex =
        /(public|private|protected)\s+\w+\s+(\w+)\([^)]*\)\s*\{?/;

    // Initialize variables to store method lengths
    const methodLengths = [];

    let insideMethod = false;
    let methodDetected = false;
    let isFirstOpening = false;

    let currentMethodLength = 0;
    let currentMethodName = "";
    let currentMethodSign = "";
    let methodNameMatch = "";

    fileContent = removeCommentsAndEmptyLines(fileContent);

    // Split the Java code into lines
    const lines = fileContent.split("\n");

    // Iterate through each line of the Java code
    for (const line of lines) {
        if ((methodNameMatch = line.trim().match(methodStartRegex))) {
            // Check if this line starts a method
            // If already inside a method, store the length of the previous method ???? TODO is this possible
            if (methodDetected) {
                methodLengths.push({
                    methodName: currentMethodName,
                    methodSign: currentMethodSign,
                    length: currentMethodLength,
                });
            }

            // Start counting lines for the new method
            currentMethodLength = 0;
            methodDetected = true;

            currentMethodName = methodNameMatch[2];
            currentMethodSign = methodNameMatch[0].replace("{", "").trim();
        }

        // If inside a method, increment the line count
        if (methodDetected) {
            isFirstOpening = !insideMethod;
            insideMethod = true;

            // If current line includes curly braces, update the stack
            if (line.includes("{")) {
                stack.push("{");
            }

            // if current line is inside the method (meaning that it is between the enclosing braces), increase current method length
            if (insideMethod) {
                let isIncrease = true;

                if (isFirstOpening) {
                    const afterOpen = line
                        .substring(line.indexOf("{") + 1)
                        .trim();

                    // if this line includes the first opening braces and right side of the brace is empty
                    // or a closing brace (which means that method body is empty),
                    // do not increase line count
                    if (afterOpen == "" || afterOpen.startsWith("}")) {
                        isIncrease = false;
                    }
                }

                if (isIncrease) {
                    currentMethodLength++;
                }
            }

            if (line.includes("}")) {
                stack.pop();
            }
        }

        // If method ends in the current line, save length data
        if (insideMethod && stack.isEmpty()) {
            const beforeClose = line.replace("}", "").trim();

            // If closing brace is solo in its line, do not include it in the counting
            if (beforeClose == "") {
                currentMethodLength--;
            }

            // Store the length of the current method
            methodLengths.push({
                methodName: currentMethodName,
                methodSign: currentMethodSign,
                length: currentMethodLength,
            });

            // Reset variables
            currentMethodLength = 0;
            currentMethodName = "";
            currentMethodSign = "";
            insideMethod = false;
            methodDetected = false;
        }
    }

    return methodLengths;
}

function removeCommentsAndEmptyLines(fileContent) {
    // Remove single-line comments
    fileContent = fileContent.replace(/\/\/.*$/gm, "");

    // Remove multi-line comments
    fileContent = fileContent.replace(/\/\*[\s\S]*?\*\//g, "");

    // Remove Javadoc comments
    fileContent = fileContent.replace(/\/\*\*[\s\S]*?\*\//g, "");

    // Remove empty lines
    fileContent = fileContent.replace(/^\s*[\r\n]/gm, "");

    return fileContent;
}
