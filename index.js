import { Config } from "./const/config.js";
import { getMethodLengths } from "./utils/max_length.js";
import { process_pr } from "./utils/process_pr.js";
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
export default (app) => {
    // Load configs
    const config = new Config();

    app.log.info("CommitSniffer is loaded!");

    console.log(getMethodLengths());

    app.on("issues.opened", async (context) => {
        const issueComment = context.issue({
            body: "Thanks for opening this issue!",
        });

        return context.octokit.issues.createComment(issueComment);
    });

    app.on(["pull_request.opened", "pull_request.edited"], async (context) => {
        // Process PR and check for code smells
        process_pr(context);

        // Create a comment
        const prComment = context.issue({
            body: "Thanks for opening this PR!",
        });

        return context.octokit.issues.createComment(prComment);
    });

    // For more information on building apps:
    // https://probot.github.io/docs/

    // To get your app running against GitHub, see:
    // https://probot.github.io/docs/development/
};
