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
                return 'Unexpected EOF while reading answer.';
            }
            if(istr[i] !== astr[i]) {
                return `Expected ${escape(astr[i])} but found ${escape(istr[i])} at ${ln}:${col}`;
            }
            if(istr[i] === '\n') [ln,col] = [ln+1,1];
            else col++;
        }
        if(istr.length != astr.length) {
            return 'Unexpected EOF while reading output.';
        }

        return null;
    }



    async testCase(i, e) {
        console.log('Using test case:', e);
        
        const info = {
            id: i,
            case: e,
        };

        const outf = `${this.problem.baseDir}/outFile.out`;
        const inf  = `${this.problem.baseDir}/testcase/${e.inFile}`;
        const ansf = `${this.problem.baseDir}/testcase/${e.ansFile}`;
        
        const args = this.buildExecArgs(this.executable, inf, outf);

        let result;
        try {
            const scr = `sudo ${__dirname}/libjudger.so ${args.join(' ')}`;
            result = JSON.parse((await exec(scr)).stdout.trim());
        } catch (e) {
            return {
                ...info,
                result: ResultEnum.SYSTEM_ERROR,
                error: e
            };
        }
        
        if(result.result != 0) {
            return {
                ...info,
                result: result.result,
                detail: result,
            };
        }

        const ansC = fs.readFileSync(ansf).toString();
        const outC = fs.readFileSync(outf).toString();
        
        const diffResult = this.diff(ansC, outC);
        
        if(diffResult) {
            result.result = ResultEnum.WRONG_ANSWER;
            return {
                ...info,
                result: ResultEnum.WRONG_ANSWER,
                detail: result,
                error: diffResult,
            };
        }

        return {
            ...info,
            result: 0,
            detail: result,
        };
    }

    async testAll() {
        const caseKeys = Object.keys(this.problem.cases);
        caseKeys.sort((a, b) => {
            const ia = parseInt(a.match(/\d+/g).join(''));
            const ib = parseInt(b.match(/\d+/g).join(''));
            return ia - ib;
        });

        let [total, good] = [0, 0];
        let cases = [];
        for(const i of caseKeys) {
            core.startGroup(`Test Case ${i}`);
            
            let ret;
            try {
                ret = await this.testCase(i, this.problem.cases[i]);
            } catch (e) {
                ret = {
                    id: i,
                    case: this.problem.cases[i],
                    result: ResultEnum.SYSTEM_ERROR,
                    error: e,
                };
            }
            
            total++, good += (ret.result == 0);
            cases.push(ret);

            core.endGroup();
        }

        return {
            result: total === good? 'Accepted': 'Unaccepted',
            total: total,
            accepted: good,
            cases,
        };
    }
}

Judger.ErrorEnum = ErrorEnum;
Judger.ResultEnum = ResultEnum;

module.exports = Judger;