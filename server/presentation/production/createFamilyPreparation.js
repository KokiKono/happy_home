/**
 * 家族構成前準備を行う。
 * Created by kokikono on 2017/11/08.
 */
import momentTimezone from 'moment-timezone';
import moment from 'moment';
import * as fs from 'fs';
import Async from 'async';


import camera from '../../ai/camera';
// import microsoftAzure from '../../ai/microsoftAzure';
import * as microsoftAzure from '../mock/microsoftAzure';
import TmpFaceAPI from '../models/tmpFaceAPI';
import TmpFaceDao from '../models/tmpFace';

// format YYYY-MM-DD:HH:mm:ss

export default class createFamilyPreparation {
    constructor(imageNum, imagePath) {
        this.imageNum = imageNum;
        this.imagePath = imagePath;
        const nowTime = momentTimezone().tz("Asia/Tokyo").format();
        this.now = moment(nowTime);
    }

    fileStatus(filePath) {
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
                    // if (diffSec > 0) {
                    //     fileList.push(`${this.imagePath}/${file}`);
                    // }
                    // デバッグ用
                    fileList.push(`${this.imagePath}/${file}`);
                }, (err3) => {
                    if (err3) reject(err3);
                    resolve(fileList);
                });
            });
        });
    }
    postFaceAPIDetects(filePaths) {
        return new Promise((resolve, reject) => {
            let processd = 0;
            const responseBody = [];
            Async.each(filePaths, (filePath) => {
                microsoftAzure.postFaceDetect(fs.createReadStream(filePath))
                    .then(async (result) => {
                        if (result.length > 0) {
                            processd += 1;
                            responseBody.push({ result, filePath });
                            // DBインサート tmp_faceAPI廃止
                            // const tmpFaceAPIDao = new TmpFaceAPI();
                            // await tmpFaceAPIDao.insert(filePath, JSON.stringify(result))
                            //     .catch((err) => { console.log(err); })
                            if (processd === filePaths.length) {
                                resolve(responseBody);
                            }
                        }
                    }).catch((postErr) => {
                        console.log(postErr);
                        processd += 1;
                        if (processd === filePaths.length) {
                            resolve(responseBody);
                        }
                });
            }, (err) => {
                if (err) reject(err);
            });
        });
    }

    start() {
        return new Promise(async (resolve, reject) => {
            // カメラ起動して複数枚写真をとる。
            // await camera(this.imageNum, this.imagePath).catch((err) => { reject(err); });
            // 撮った写真の取得
            const files = await this.readCarefullySelectedImageFiles()
                .catch((err) => { reject(err); });
            // 撮った写真をfaceAPIに投げる
            const detects = await this.postFaceAPIDetects(files).catch((err) => { reject(err); });
            // faceListからfaceIdを抽出
            const faceIds = [];
            Async.each(detects, (detect) => {
                Async.each(detect.result, (face) => {
                    faceIds.push(face.faceId);
                });
            });
            // faceIdsをグルーピング
            const { groups } = await microsoftAzure.postFaceGroup(faceIds);
            // グルーピングしたものから適当な代表faceIdを決定しDBにインサート
            Async.each(groups, async (group) => {
                // 代表faceId
                const modelFaceId = group[Math.floor(Math.random() * group.length)];
                // 代表faceIdのdetect情報
                let detect = detects.filter((detect) => detect.result.find(face => (face.faceId === modelFaceId)));// eslint-disable-line
                if (detect instanceof Array) {
                    detect = detect[0]; // eslint-disable-line
                }
                const { result, filePath } = detect;
                // faceGroup情報をDBにインサート
                const tmpFaceDao = new TmpFaceDao();
                await tmpFaceDao.insertRelation(modelFaceId, filePath, JSON.stringify(result))
                    .then((results) => {
                        Async.each(group, async (item) => {
                            const tmpFaceDao2 = new TmpFaceDao();
                            await tmpFaceDao2.insertGroup(results.insertId, item);
                        });
                    }).catch((err) => {
                        reject(err);
                    });
            });
            resolve();
        });
    }

}
