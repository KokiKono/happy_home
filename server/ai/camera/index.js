import * as childProcess from 'child_process';
import * as path from 'path';

const run = (num, imagePath) => { // eslint-disable-line
    return new Promise((resolve, reject) => { // eslint-disable-line
        console.log(`python ${path.join(__dirname, 'camera.py')} ${num} ${imagePath}`);
        // childProcess.exec(`python ./camera.py ${num}`, (err, stdout) => {
        //     if (err) {
        //         reject(err);
        //     }
        //     resolve(stdout);
        // });
        childProcess.exec(`python ${path.join(__dirname, 'camera.py')} ${num} ${imagePath}`, (err, stdout) => {
            if (err) {
                reject(err);
            }
            resolve(stdout);
        });
    });
};
export default run;
