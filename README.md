# CommitSniffer

CommitSniffer is a bot that inspects pull requests and adds comments based on your code, helping you improve your codebase before merging.

## Installation

Install NodeJS from this link. Ensure that you have NodeJS and NPM installed in your system.

Check if NodeJS and NPM are installed by running the following commands in your terminal:

```
node -v
npm -v
```

These commands should return version numbers.

## Setting Environment Variables

Open the CommitSniffer project and add a `.env` file.

Request private keys from developers and add them to your `.env` file.

Put your own GitHub API and Gemini API keys in the `.env` file.

## Setting Up Your Project

Open your project and add a `commitsniffer.config` file, which can be found in the CommitSniffer repository.

Go to CommitSniffer GitHub App and click the “Configure” button.

Select the account or organization you want to add the bot to.

In the repository access section, add the bot to the repositories you want to use and save.

## Usage

Run the bot by executing the following command in your terminal:

```
npm start
```

Whenever you create or reopen a pull request in the repositories where you have added the bot, CommitSniffer will inspect the pull request and add comments based on your code. You should edit your codebase depending on those code reviews before merging the pull request.
