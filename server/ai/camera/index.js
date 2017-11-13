import * as childProcess from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import Async from 'async';
import momentTimezone from 'moment-timezone';
import moment from 'moment';
import deepEqual from 'deep-equal';
import oxford from 'project-oxford';

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

    postFaceAPIDetects(microsoftAzure, filePaths) { // eslint-disable-line
        return new Promise((resolve, reject) => {
            let process = 1;
            const responseBody = [];
            Async.each(filePaths, (filePath) => {
                microsoftAzure.postFaceDetect(fs.createReadStream(filePath))
                    .then((result) => {
                        process += 1;
                        if (result.length > 0) {
                            responseBody.push({ result, filePath });
                        }
                        if (process === filePaths.length) {
                            resolve(responseBody);
                        }
                    }).catch((postErr) => {
                    console.log(postErr);
                    process += 1;
                    if (process === filePaths.length) {
                        resolve(responseBody);
                    }
                });
            }, (err) => {
                if (err) reject(err);
                resolve(responseBody);
            });
        });
    }

    static findDetects(faceId, detects) {
        let detect = null;
        detects.some((detectDetail) => {
            const result = detectDetail.result.find(item => item.faceId === faceId);
            if (result) {
                detect = { result, filePath: detectDetail.filePath };
                return true;
            };
            return false;
        })
        return detect;
    }

    postEmotionAPI(microsoftAzure, filePaths) {
        return new Promise((resolve, reject) => {
            let process = 1;
            const responseBody = [];
            const client = new oxford.Client('');
            Async.each(filePaths, (filePath) => {
                client.emotion.analyzeEmotion({ path: filePath })
                    .then((result) => {
                        process += 1;
                        if (result.length > 0) {
                            responseBody.push({ result, filePath });
                        }
                        if (process === filePaths.length) {
                            resolve(responseBody);
                        }
                    }).catch((postErr) => {
                    console.log(postErr);
                    process += 1;
                    if (process === filePaths.length) {
                        resolve(responseBody);
                    }
                });
            }, (err) => {
                if (err) reject(err);
                resolve(responseBody);
            });
        });
    }

    static findEmotion(emotions, faceRectangle) {
        let emotion = null;
        emotions.some((emotionDetail) => {
            emotion = emotionDetail.find((item) => {
                return deepEqual(item.emotion.faceRectangle, faceRectangle);
            });
            if (emotion) return true;
            return false;
        });
        return emotion;
    }

    static mostFindSimilar(similarList) {
        let most = { confidence: 0 };
        similarList.forEach((item) => {
            if (item.confidence > most.confidence) most = item;
        });
        return most;
    }
}
