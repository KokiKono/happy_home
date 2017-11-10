import * as childProcess from 'child_process';

const run = (num) => { // eslint-disable-line
    return new Promise((resolve, reject) => { // eslint-disable-line
        return childProcess.exec(`python camera.py ${num}`, (err, stdout) => {
            if (err) {
                reject(err);
            }
            resolve(stdout);
        });
    });
};
export default run;
