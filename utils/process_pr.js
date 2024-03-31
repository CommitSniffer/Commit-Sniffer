import { sendContentRequest, sendFileRequest } from "../request/request.js";

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
    // get updated files in the current PR

    const result = sendFileRequest(
        context.payload.repository.owner.login,
        context.payload.repository.name,
        context.payload.number
    );

    // get contents of the each updated file
    result
        .then((data) => {
            console.log("Response data:", data);
            const fileContents = processArrayItems(data);

            fileContents
                .then((data) => {
                    console.log("Alioooo", data);
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
            console.error("Error:", error);
        });
}

function check_pr_content(content) {
    console.log(content[0]);
}
