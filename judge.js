const core = require('@actions/core');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');

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
};

const ResultEnum = {
    WRONG_ANSWER: -1,
    CPU_TIME_LIMIT_EXCEEDED: 1,
    REAL_TIME_LIMIT_EXCEEDED: 2,
    MEMORY_LIMIT_EXCEEDED: 3,
    RUNTIME_ERROR: 4,
    SYSTEM_ERROR: 5,
};

class Judger {

    constructor(prob, exe){
        this.problem = prob;
        this.executable = exe;
    }

    buildExecArgs(exe, inf, ouf) {
        // console.log(this.problem)
        const ret = [];
        ret.push(`--exe_path=${exe}`,
            `--input_path=${inf}`,
            `--output_path=${ouf}`,
            `--error_path=${ouf}`,
            `--max_output_size=${134217728}`,
        );
        
        if(this.problem.conf.time_limit) {
            ret.push(`--max_real_time=${this.problem.conf.time_limit}`);
        }
        
        if(this.problem.conf.space_limit){
            ret.push(`--max_memory=${this.problem.conf.space_limit * 1048576}`);
        }

        return ret;
    }

    diff(istr, astr){
        [istr,astr] = [istr.trim(),astr.trim()];
        let ln = 1, col = 1;
        for(const i in istr){
            if(i >= astr.length) {
                core.setFailed('Unexpected EOF while reading answer.');
                return false;
            }
            if(istr[i] !== astr[i]) {
                core.setFailed(`Expected ${escape(astr[i])} but found ${escape(istr[i])} at ${ln}:${col}`);
                return false;
            }
            if(istr[i] === '\n') [ln,col] = [ln+1,1];
            else col++;
        }
        if(istr.length != astr.length) {
            core.setFailed('Unexpected EOF while reading output.');
            return false;
        }

        return true;
    }

    async runSol(inFile, outf) {
        const args = this.buildExecArgs(this.executable, inFile, outf);
        
        try {
            const scr = `sudo ${__dirname}/libjudger.so ${args.join(' ')}`;
            return JSON.parse((await exec(scr)).stdout.trim());
        } catch (e) {
            core.error(e);
            core.setFailed('Unknown Error');
        }
    }

    async testAll() {

        for(const i of Object.keys(this.problem.cases)) {
            core.startGroup(`Test Case ${i}`);
            const e = this.problem.cases[i];
            
            const outf = `${this.problem.baseDir}/outFile.out`;
            const inf  = `${this.problem.baseDir}/testcase/${e.inFile}`;
            const ansf = `${this.problem.baseDir}/testcase/${e.ansFile}`;
            
            const result = await this.runSol(inf,outf);

            if((+result.result) != 0) console.log(result);

            switch(+result.result) {
            case 0: break;
            case ResultEnum.CPU_TIME_LIMIT_EXCEEDED:
            case ResultEnum.REAL_TIME_LIMIT_EXCEEDED:
                core.setFailed('Time Limit Exceeded');
                continue;
            case ResultEnum.MEMORY_LIMIT_EXCEEDED:
                core.setFailed('Memory Limit Exceeded');
                continue;
            case ResultEnum.RUNTIME_ERROR:
                core.setFailed('Runtime Error');
                continue;
            case ResultEnum.SYSTEM_ERROR:
            default:
                core.setFailed(`System Error ${result.error}`);
                continue;
            }

            const ansC = fs.readFileSync(ansf).toString();
            const outC = fs.readFileSync(outf).toString();
            
            const diffResult = this.diff(ansC, outC);
            result.result = diffResult? 0 : ResultEnum.WRONG_ANSWER;

            console.log(result);
            core.endGroup();
        }
    }
}

Judger.ErrorEnum = ErrorEnum;
Judger.ResultEnum = ResultEnum;

module.exports = Judger;