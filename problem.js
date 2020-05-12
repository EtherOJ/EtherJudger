const yaml = require('yaml');
const core = require('@actions/core');
const fs = require('fs');

class Problem {

    constructor(dir){
        this.baseDir = dir;
        this.rawConf = fs.readFileSync(`${this.baseDir}/problem.yml`).toString();
        this.conf = yaml.parse(this.rawConf);
        this.cases = this.scanTestCases();
        console.log(this.conf);
        console.log(this.cases);
    }

    scanTestCases() {
        const files = fs.readdirSync(`${this.baseDir}/testcase`);
        const cases = {};
        const retCases = {};

        for(const f of files) {
            const k = f.split('.');
            const suffix = k.slice(-1)[0];
            if(/^(in|ans)$/g.test(suffix)){
                const name = k.slice(0,-1).join('.');
                // if(parseInt(name)) {
                if(cases[name]) cases[name][`${suffix}File`] = f;
                else cases[name] = { 
                    [`${suffix}File`]: f,
                };
                // }
            }
        }
        for(const el of Object.keys(cases)){
            if(Object.keys(cases[el]).length != 2) continue;
            retCases[el] = cases[el];
        }
        return retCases;
    }
}

module.exports = Problem;