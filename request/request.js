import { Octokit } from "@octokit/core";
import { Config } from "../const/config.js";

const octokit = new Octokit({
    auth: Config.GITHUB_API_KEY,
});

export async function sendDiffFileRequest(owner, repo, pull_number) {
    const url = "/repos/{owner}/{repo}/pulls/{pull_number}";
    const acceptMediaTypes = [
        "application/vnd.github.diff",
        "application/vnd.github.raw+json",
    ];

    try {
        const response = await octokit.request(`GET ${url}`, {
            owner: owner,
            repo: repo,
            pull_number: pull_number,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
                Accept: acceptMediaTypes.join(","),
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error occurred while fetching the diff file:", error);
    }
}

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

        return response.data;
    } catch (error) {
        console.error("Error occurred while fetching files:", error);
    }
}

export async function publishPrReview(owner, repo, pull_number, diff_file) {
    const url = "/repos/{owner}/{repo}/pulls/{pull_number}/reviews";

    try {
        const response = await octokit.request(`POST ${url}`, {
            owner: owner,
            repo: repo,
            pull_number: pull_number,
            body: "Please update your branch according to suggested changes!",
            event: "REQUEST_CHANGES",
            comments: [
                {
                    path: "src/Client.java",
                    position: 1,
                    body: "Please add more information here, and fix this typo.",
                },
            ],
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error occurred while fetching files:", error);
    }
}

export async function sendContentRequest(url) {
    try {
        const response = await octokit.request(`GET ${url}`, {
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error occurred while fetching file content:", error);
    }
}
