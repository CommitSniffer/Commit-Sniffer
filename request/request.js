import { Octokit } from "@octokit/core";
import { Config } from "../const/config.js";

const octokit = new Octokit({
    auth: Config.GITHUB_API_KEY,
});

export async function sendFileRequest(owner, repo, pull_number) {
    const url = "/repos/{owner}/{repo}/pulls/{pull_number}/files";

    try {
        const response = await octokit.request(`GET ${url}`, {
            owner: owner,
            repo: repo,
            pull_number: pull_number,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        // Handle the response here
        // console.log("response", response.data); // Output the response data
        return response.data;
    } catch (error) {
        console.error("Error occurred while fetching pull request:", error);
    }
}

export async function sendContentRequest(url) {
    try {
        const response = await octokit.request(`GET ${url}`, {
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        // Handle the response here
        // console.log("response", response.data); // Output the response data
        return response.data;
    } catch (error) {
        console.error("Error occurred while fetching pull request:", error);
    }
}
