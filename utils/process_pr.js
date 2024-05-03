import {
    sendContentRequest,
    sendDiffFileRequest,
    sendFileRequest,
} from "../request/request.js";
import { checkMethodLengths } from "./max_fcn_length.js";
import { createReviewObj } from "./common/review_object.js";
import { checkUnnecessaryNesting } from "./nesting.js";
import { checkSqlInjection } from "./sql_injection.js";
import { checkUnusedImports } from "./unused_import.js";
import { checkIncorrectNamingConventions } from "./naming.js";
import { checkWildcardImports } from "./wildcard_import.js";
import { checkCommentSmells } from "./comment_smell.js";
import { checkClassLengths } from "./max_class_length.js";
import { checkUnusedVariables } from "./unused_variables.js";
import { CONFIG } from "../const/config.js";

export async function process_pr(context) {
    // Get updated files in the current PR
    return {
        review: await process_pr_for_diffs(context),
        comment: await process_pr_for_files(context),
    };
}

async function process_pr_for_files(context) {
    // Get updated files in the current PR
    try {
        const data = await sendFileRequest(
            context.payload.repository.owner.login,
            context.payload.repository.name,
            context.payload.number
        );

        const fileContents = await processArrayItems(data);
        const files = fileContents.map((file) => ({
            contentString: contentToString(file.content),
            path: file.path,
        }));

        return check_pr_content(files);
    } catch (error) {
        console.error("Error processing pr content:", error);
    }
}

async function process_pr_for_diffs(context) {
    // Get updated files in the current PR
    try {
        const data = await sendDiffFileRequest(
            context.payload.repository.owner.login,
            context.payload.repository.name,
            context.payload.number
        );

        return check_pr_diff_content(data);
    } catch (error) {
        console.error("Error processing for diffs:", error);
    }
}

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

async function check_pr_content(files) {
    const results = [];
    for (const file of files) {
        // !!! ADD OTHER CHECKS BELOW THIS LINE !!!
        if (CONFIG.METHOD_LENGTHS) results.push(checkMethodLengths(file.contentString));
        if (CONFIG.UNUSED_IMPORTS) results.push(checkUnusedImports(file.contentString, file.path));
        if (CONFIG.UNUSED_VARIABLES) results.push(checkUnusedVariables(file.contentString, file.path));
        if (CONFIG.INCORRECT_NAMING_CONVENTIONS) results.push(checkIncorrectNamingConventions(file.contentString, file.path));
        if (CONFIG.WILDCARD_IMPORTS) results.push(checkWildcardImports(file.contentString, file.path));
        if (CONFIG.CLASS_LENGTHS) results.push(checkClassLengths(file.contentString, file.path));

        // !!! ADD GEN-AI BASED CHECKS BELOW THIS LINE !!!
        if (CONFIG.UNNECESSARY_NESTING) results.push(await checkUnnecessaryNesting(file.contentString, file.path));
        if (CONFIG.SQL_INJECTION) results.push(await checkSqlInjection(file.contentString, file.path));
        if (CONFIG.COMMENT_SMELLS) results.push(await checkCommentSmells(file.contentString, file.path));
    };

    return results;
}

function check_pr_diff_content(diff_files) {
    const results = [];

    results.push(
        createReviewObj(diff_files.split(" ")[0], "src/Client.java", 5)
    );

    return results;
}
