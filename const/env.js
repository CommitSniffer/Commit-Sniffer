import { config } from "dotenv";
config();

export class ENV {
    static GITHUB_API_KEY = process.env.GITHUB_API_KEY || undefined;
    static GEMINI_API_KEY = process.env.GEMINI_API_KEY || undefined;

    constructor() {
        if (
            ENV.GITHUB_API_KEY === undefined ||
            ENV.GEMINI_API_KEY === undefined
        ) {
            throw new Error("One or more required environment variables are not found in the environment");
        }

        console.log("Environment variables are loaded successfully");
    }
}
