import { sendContentRequest, sendFileRequest } from "../request/request.js";
import { checkMethodLengths } from "./max_length.js";
import { checkImports } from "./unused_import.js";

async function processArrayItems(fileData) {
    try {
        const results = await Promise.all(
            fileData.map((item) => sendContentRequest(item.contents_url))
        );
        return results;
    } catch (error) {
        console.error("Error processing array items:", error);
        throw error;
    }
}

function contentToString(content) {
    return Buffer.from(content, "base64").toString("utf-8");
}

export function process_pr(context) {
    // Get updated files in the current PR
    return sendFileRequest(
        context.payload.repository.owner.login,
        context.payload.repository.name,
        context.payload.number
    )
    .then((data) => {
        console.log("File request is successful");
        return processArrayItems(data);
    })
    .then((fileContents) => {
        console.log("File contents are fetched successfully");
        return fileContents.map((file) => ({
            contentString: contentToString(file.content),
            path: file.path,
        }));
    })
    .then((files) => {
        console.log("Files are prepared for checking");
        return check_pr_content(files);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function check_pr_content(files) {
    const results = [];
    files.forEach((file) => {
        // !!! ADD OTHER CHECKS BELOW THIS LINE !!!
        results.push(checkMethodLengths(file.contentString));
        results.push(checkImports(file.contentString, file.path));
    });

    return results;
}
