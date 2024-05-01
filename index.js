import { Config } from "./const/config.js";
import { process_pr } from "./utils/process_pr.js";
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
export default (app) => {
    // Load configs
    const config = new Config();

    app.log.info("CommitSniffer is loaded!");

    // console.log(getMethodLengths());

    app.on("issues.opened", async (context) => {
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
                // Process PR and check for code smells
                const result = await process_pr(context);

                console.log("review", result.review);
                console.log("comment", result.comment);
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
                result.review.forEach((reviewObject) => {
                    createReview(context, reviewObject);
                });
            } catch (error) {
                console.error("Error processing PR:", error);
                const prComment = context.issue({
                    body: "We cannot process your PR right now :(\nPlease try again later.",
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

    function createReview(context, reviewObj) {
        const owner = context.payload.repository.owner.login;
        const repo = context.payload.repository.name;
        const pull_number = context.payload.number;

        const review = context.octokit.pulls.createReview({
            owner: owner,
            repo: repo,
            pull_number: pull_number,
            body: "Please update your branch according to suggested changes!",
            event: "REQUEST_CHANGES", // Specify the review action (APPROVE, REQUEST_CHANGES, or COMMENT)
            comments: [
                {
                    position: reviewObj.position,
                    path: reviewObj.filePath,
                    body: reviewObj.msg,
                    // You can optionally specify comments[].position if needed
                },
                // Add more comments if necessary
            ],
        });
    }

    // For more information on building apps:
    // https://probot.github.io/docs/

    // To get your app running against GitHub, see:
    // https://probot.github.io/docs/development/
};
