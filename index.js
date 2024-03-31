import { Config } from "./const/config.js";
import { getMethodLengths } from "./utils/max_length.js";
import { process_pr } from "./utils/process_pr.js";
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
export default (app) => {
    const config = new Config();
    // Your code here
    app.log.info("Yay, the app was loaded!");
    getMethodLengths();

    app.on("issues.opened", async (context) => {
        const issueComment = context.issue({
            body: "Thanks for opening this issue!",
        });

        getMethodLengths();
        return context.octokit.issues.createComment(issueComment);
    });

    app.on(
        [
            "pull_request.opened",
            "pull_request.edited",
            "pull_request.synchronise",
        ],
        async (context) => {
            const issueComment = context.issue({
                body: "Thanks for opening this PR!",
            });

            process_pr(context);
            return context.octokit.issues.createComment(issueComment);
        }
    );

    // For more information on building apps:
    // https://probot.github.io/docs/

    // To get your app running against GitHub, see:
    // https://probot.github.io/docs/development/
};
