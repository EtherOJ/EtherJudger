const github = require('@actions/github');

const token = process.env['GITHUB_TOKEN'];
const octokit = new github.GitHub(token);

class CheckrunResult {

    constructor(annotations, success, summary){
        this.annotations = annotations;
        this.success = success;
        this.summary = summary;
    }

    async applyCheckrun () {
        const result = await (octokit.checks.create({
            ...github.context.repo,
            name: 'Judge',
            head_sha: github.context.payload.pull_request.head.sha,
            status: 'completed',
            conclusion: this.success ? 'success' : 'failure',
            output: {
                title: 'Judge Result',
                summary: this.summary,
                annotations: this.annotations,
            }
        }));
        console.log(result);
    }
}

CheckrunResult.createAnnotation = function(failed, message, rawDetails) {
    return {
        path: 'solution.cpp',
        start_line: 0,
        end_line: 0,
        annotation_level: failed? 'notice' : 'failure',
        message,
        raw_details: rawDetails
    };
};

module.exports = CheckrunResult;
