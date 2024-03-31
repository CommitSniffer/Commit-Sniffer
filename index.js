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

    app.on(["pull_request.opened", "pull_request.edited"], async (context) => {
        // Process PR and check for code smells
        process_pr(context)
            .then((result) => {
                // Create a comment TODO this part should be updated so that it becomes compatible with other fearutes
                result.forEach((msgGroup) => {
                    if (msgGroup.length == 0) {
                        return;
                    }

                    let msg = msgGroup;
                    if (Array.isArray(msgGroup)) {
                        msg = msgGroup.join("\n");
                    } else {
                    }

                    createComment(context, msg);
                });
            })
            .catch((error) => {
                console.error("Error processing PR:", error);
                const prComment = context.issue({
                    body: "We cannot process your PR right now :(\nPlease try again later.",
                });
                return context.octokit.issues.createComment(prComment);
            });
    });

    function createComment(context, msg) {
        const comment = context.issue({
            body: msg,
        });
        return context.octokit.issues.createComment(comment);
    }

    // For more information on building apps:
    // https://probot.github.io/docs/

    // To get your app running against GitHub, see:
    // https://probot.github.io/docs/development/
};
