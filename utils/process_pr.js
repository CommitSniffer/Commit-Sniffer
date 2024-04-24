import { sendContentRequest, sendFileRequest } from "../request/request.js";
import { getMethodLengths, getIncorrectNamingConventions } from "./max_length.js";

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
    console.log(Buffer.from(content, "base64").toString("utf-8"));
    return Buffer.from(content, "base64").toString("utf-8");
}

export function process_pr(context) {
    // Get updated files in the current PR

    const result = sendFileRequest(
        context.payload.repository.owner.login,
        context.payload.repository.name,
        context.payload.number
    );

    // Get contents of the each updated file
    result
        .then((data) => {
            console.log("File request is successful");
            const fileContents = processArrayItems(data);

            fileContents
                .then((data) => {
                    console.log("File contents are fetched successfuly");
                    const contentString = data.map((file) =>
                        contentToString(file.content)
                    );
                    check_pr_content(contentString);
                })
                .catch((error) => {
                    console.error("Error1:", error);
                });
        })
        .catch((error) => {
            console.error("Error2:", error);
        });
}

function check_pr_content(contents) {
    contents.forEach((file) => {
        console.log(file);
        // !!! ADD OTHER CHECKS BELOW THIS LINE !!!
        getMethodLengths(file);
        getIncorrectNamingConventions(file);
    });
}
