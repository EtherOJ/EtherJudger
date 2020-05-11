const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

const fs = require('fs');
const Problem = require('./problem');
const Judger = require('./judge');

(async () => {

const context = github.context;
if (context.eventName !== "pull_request") {
    core.setFailed('This Action should be triggered in a Pull Request');
    return;
}

const token = process.env['GITHUB_TOKEN'] || "";
  if (token === "") {
    core.setFailed('No GITHUB_TOKEN was provided');
    return;
}

const workdir = process.env['GITHUB_WORKSPACE'];
const branch  = process.env['GITHUB_BASE_REF'];

const src = core.getInput('source');
const dataRepo = core.getInput('problem-repo');

let problem;
core.startGroup('Checkout problem data');
try {
    await exec.exec(`git clone --depth=1 -b ${branch} ${dataRepo} pdata`)
    problem = new Problem(`${workdir}/pdata`);
} catch (e) {
    core.setFailed("Error processing problem");
    return;
}
core.endGroup();

const destExecutable = `${__dirname}/solution.o`;

core.startGroup('Compile Source');
try {
    await exec.exec(`g++ ${src} -o ${destExecutable}`);
} catch (e) {
    core.error(e);
    core.setFailed('Compilation Error');
    return;
}
core.endGroup();

const judger = new Judger(problem, destExecutable);
try {
    await judger.testAll();
}catch(e){
    core.setFailed(e)
}


})();

