const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

const Problem = require('./problem');
const Judger = require('./judge');

function __fail(info, result = -1) {
    core.setFailed(`Result\n${JSON.stringify({
        result,
        error: info,
    })}`);
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
    const branch  = process.env['GITHUB_BASE_REF'];

    const src = core.getInput('source');
    const dataRepo = core.getInput('problem-repo');

    let problem;
    core.startGroup('Checkout problem data');
    try {
        await exec.exec(`git clone --depth=1 -b ${branch} ${dataRepo} pdata`);
        problem = new Problem(`${workdir}/pdata`);
    } catch (e) {
        __fail('Error processing problem');
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
        if(rst.accepted === 0) {
            core.warning(`Result\n${JSON.stringify(rst)}`);
        } else {
            core.setFailed(`Result\n${JSON.stringify(rst)}`);
        }
        
    }catch(e){
        core.setFailed(e);
    }


})();

