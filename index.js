const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const fs = require('fs').promises;

const Problem = require('./problem');
const Judger = require('./judge');

function __fail(info, result = -1) {
    core.setFailed(`Result\n${JSON.stringify({
        result,
        error: info,
    }, null, 2)}`);
}

(async () => {

    const context = github.context;
    if (context.eventName !== 'pull_request') {
        __fail('This Action should be triggered in a Pull Request', -13);
        return;
    }

    const token = process.env['GITHUB_TOKEN'] || '';
    if (token === '') {
        __fail('No GITHUB_TOKEN was provided', -13);
        return;
    }

    const workdir = process.env['GITHUB_WORKSPACE'];

    const src = 'solution.cpp';

    core.startGroup('Checkout problem data');
    let problem;
    try {
        const k = await fs.readFile('.problem');
        const [remote, ref] = k.toString().trim().split(' ');
        await exec.exec('git init pdata');
        const cwd = [undefined, { cwd : 'pdata' }];

        await exec.exec(`git remote add origin ${remote}`, ...cwd);
        await exec.exec(`git fetch origin +${ref}:refs/remotes/origin/master`, ...cwd);
        await exec.exec('git checkout -B master refs/remotes/origin/master', ...cwd);
        problem = new Problem(`${workdir}/pdata`);
        
    } catch (e) {
        __fail(`Error processing problem:: ${e}`, -15);
        return;
    }

    core.endGroup();

    const destExecutable = `${__dirname}/solution.o`;

    core.startGroup('Compile Source');
    try {
        await exec.exec(`g++ ${src} -o ${destExecutable}`);
    } catch (e) {
        core.error(e);
        __fail('Compilation Error');
        return;
    }
    core.endGroup();

    const judger = new Judger(problem, destExecutable);
    try {
        const rst = await judger.testAll();
        if(rst.result === 'Accepted') {
            core.warning(`Result\n${JSON.stringify(rst, null, 2)}`);
        } else {
            core.setFailed(`Result\n${JSON.stringify(rst, null, 2)}`);
        }
        
    }catch(e){
        core.setFailed(e);
    }


})();

