import { ENV } from "./const/env.js";
import { CONFIG, setConfig } from "./const/config.js";
import { process_pr } from "./utils/process_pr.js";
import { createReviewObj } from "./utils/common/review_object.js";
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
export default (app) => {
    // Load environment variables
    const envVars = new ENV();

    app.log.info("CommitSniffer is loaded!");

    app.on("issues.opened", async (context) => {
        await setConfig(context);
        const issueComment = context.issue({
            body: "Thanks for opening this issue!",
        });

        createComment(context, "slm");
        return;
    });

    app.on(
        ["pull_request.opened", "pull_request.edited", "pull_request.reopened"],
        async (context) => {
            try {
                await setConfig(context);

                // Process PR and check for code smells
                const result = await process_pr(context);

                result.comment.forEach((msgGroup) => {
                    if (msgGroup.length == 0) {
                        return;
                    }

                    let msg = msgGroup;
                    if (Array.isArray(msgGroup)) {
                        msg = msgGroup.join("\n");
                    }

                    createComment(context, msg);
                });

                const resultsFlattenedLength = result.comment.reduce(
                    (acc, curr) => acc.concat(curr),
                    []
                ).length;

                if (resultsFlattenedLength >= CONFIG.MIN_REJECT_THRESHOLD) {
                    createReview(
                        context,
                        createReviewObj(
                            `\`${resultsFlattenedLength}\` code smells are detected exceeding the threshold \`${CONFIG.MIN_REJECT_THRESHOLD - 1}\`!`,
                            result.filePath,
                            0
                        )
                    );
                } else if (resultsFlattenedLength <= 1) {
                    createReview(
                        context,
                        createReviewObj(
                            `Well Done! No code smells are detected.`,
                            result.filePath,
                            0
                        ),
                        false
                    );
                } else {
                    createReview(
                        context,
                        createReviewObj(
                            `\`${resultsFlattenedLength}\` code smells are detected which is below the threshold \`${CONFIG.MIN_REJECT_THRESHOLD - 1}\``,
                            result.filePath,
                            0
                        ),
                        false
                    );
                }
            } catch (error) {
                console.error("Error processing PR:", error);
                const prComment = context.issue({
                    body: "We cannot process your PR right now :(\n" + error,
                });
                return context.octokit.issues.createComment(prComment);
            }
        }
    );

    function createComment(context, msg) {
        const comment = context.issue({
            body: msg,
        });
        return context.octokit.issues.createComment(comment);
    }

    function createReview(context, reviewObj, requestChange = true) {
        const owner = context.payload.repository.owner.login;
        const repo = context.payload.repository.name;
        const pull_number = context.payload.number;

        const review = context.octokit.pulls.createReview({
            owner: owner,
            repo: repo,
            pull_number: pull_number,
            body: requestChange
                ? `Please update your branch according to suggested changes! ${reviewObj.msg}`
                : reviewObj.msg,
            event: requestChange ? "REQUEST_CHANGES" : "APPROVE", // (APPROVE, REQUEST_CHANGES, or COMMENT)
            // comments: [
            //     {
            //         position: reviewObj.position,
            //         path: reviewObj.filePath,
            //         body: reviewObj.msg,
            //     },
            // ],
        });
    }

    // For more information on building apps:
    // https://probot.github.io/docs/

    // To get your app running against GitHub, see:
    // https://probot.github.io/docs/development/
};
