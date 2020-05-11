import * as core from "@actions/core";
import * as github from "@actions/github";

(() => {

const context = github.context;
if (context.eventName !== "pull_request") {
    core.setFailed('This Action should be triggered in a Pull Request');
    return;
}

const token = process.env["GITHUB_TOKEN"] || "";
  if (token === "") {
    core.setFailed('No GITHUB_TOKEN was provided');
    return;
}

core.info(__dirname,__filename)

})();

