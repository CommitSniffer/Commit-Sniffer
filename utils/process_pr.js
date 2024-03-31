import { sendContentRequest, sendFileRequest } from "../request/request.js";
import { checkMethodLengths } from "./max_length.js";

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
            console.log("File contents are fetched successfuly");
            const contentStrings = fileContents.map((file) =>
                contentToString(file.content)
            );
            return check_pr_content(contentStrings);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

function check_pr_content(contents) {
    const results = [];
    contents.forEach((file) => {
        // !!! ADD OTHER CHECKS BELOW THIS LINE !!!
        results.push(checkMethodLengths(file));
    });

    return results;
}
