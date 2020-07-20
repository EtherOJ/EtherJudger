const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const fs = require('fs').promises;

const Problem = require('./problem');
const Judger = require('./judge');

const ErrorEnum = {
    SUCCESS: 0,
    INVALID_CONFIG: -1,
    FORK_FAILED: -2,
    PTHREAD_FAILED: -3,
    WAIT_FAILED: -4,
    ROOT_REQUIRED: -5,
    LOAD_SECCOMP_FAILED: -6,
    SETRLIMIT_FAILED: -7,
    DUP2_FAILED: -8,
    SETUID_FAILED: -9,
    EXECVE_FAILED: -10,
    SPJ_ERROR: -11,
    GA_WRONG_TRIGGER: -258,
    GA_UNAUTHORIZED: -259,
    CHECKOUT_FAILED: -273,
    COMPILE_ERROR: -274,
};

function __fail(info, result = -1) {
    core.setFailed(`Result\n${JSON.stringify({
        result: 'Error',
        error: result,
        error_message: info,
    }, null, 2)}`);
}



(async () => {

    const context = github.context;
    if (context.eventName !== 'pull_request') {
        __fail('This Action should be triggered in a Pull Request', ErrorEnum.GA_WRONG_TRIGGER);
        return;
    }

    const token = process.env['GITHUB_TOKEN'] || '';
    if (token === '') {
        __fail('No GITHUB_TOKEN was provided', ErrorEnum.GA_UNAUTHORIZED);
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
        __fail(`Error processing problem:: ${e}`, ErrorEnum.CHECKOUT_FAILED);
        return;
    }

    core.endGroup();

    const destExecutable = `${__dirname}/solution.o`;

    core.startGroup('Compile Source');
    try {
        await exec.exec(`g++ ${src} -o ${destExecutable}`);
    } catch (e) {
        __fail(`Compilation Error:: ${e}`, ErrorEnum.COMPILE_ERROR);
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

