import { config } from "dotenv";
config();

export class Config {
    static GITHUB_API_KEY = process.env.GITHUB_API_KEY || undefined;

    constructor() {
        if (Config.GITHUB_API_KEY === undefined) {
            throw new Error("Github key is not found in the environment.");
        }

        console.log("configs are loaded");
    }
}
