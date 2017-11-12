import * as childProcess from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import Async from 'async';
import momentTimezone from 'moment-timezone';
import moment from 'moment';

export default class Camera {
    constructor(imageNum, imagePath) {
        this.imageNum = imageNum;
        this.imagePath = imagePath;
        const nowTime = momentTimezone().tz('Asia/Tokyo').format();
        this.now = moment(nowTime);
    }

    /**
     * 指定された写真を複数枚撮る。
     * @returns {Promise}
     */
    take() {
        return new Promise((resolve, reject) => { // eslint-disable-line
            console.log(`python ${path.join(__dirname, 'camera.py')} ${this.imageNum} ${this.imagePath}`);
            childProcess.exec(`python ${path.join(__dirname, 'camera.py')} ${this.imageNum} ${this.imagePath}`, (err, stdout) => {
                if (err) {
                    reject(err);
                }
                resolve(stdout);
            });
        });
    }

    fileStatus(filePath) { // eslint-disable-line
        return new Promise((resolve, reject) => {
            fs.stat(filePath, (err, stats) => {
                if (err) reject(err);
                resolve(stats);
            });
        });
    }

    /**
     * インスタンス作成されてからカメラで撮った写真のfileリストを返す。
     * @returns {Promise}
     */
    readCarefullySelectedImageFiles() {
        return new Promise((resolve, reject) => {
            fs.readdir(this.imagePath, (err, files) => {
                if (err) reject(err);
                let fileList = []; // eslint-disable-line
                Async.each(files, async (file) => {
                    // 画像ファイルのみ
                    if (!/.*\.jpg$/.test(file)) { return; }
                    const status = await this.fileStatus(`${this.imagePath}/${file}`).catch((err2) => { reject(err2); });
                    const atime = moment(status.atime);
                    const diffSec = atime.diff(this.now.format(), 'milliseconds');
                    if (diffSec > 0) {
                        fileList.push(`${this.imagePath}/${file}`);
                    }
                    // デバッグ用
                    // fileList.push(`${this.imagePath}/${file}`);
                }, (err3) => {
                    if (err3) reject(err3);
                    resolve(fileList);
                });
            });
        });
    }
}