/**
 * 家族構成前準備を行う。
 * Created by kokikono on 2017/11/08.
 */
import * as fs from 'fs';
import Async from 'async';

import Camera from '../../ai/camera';
import * as microsoftAzure from '../../ai/microsoftAzure';
// import * as microsoftAzure from '../mock/microsoftAzure';
import TmpFaceDao from '../models/tmpFace';

export default class createFamilyPreparation {
    constructor(imageNum, imagePath) {
        this.imageNum = imageNum;
        this.imagePath = imagePath;
    }

    postFaceAPIDetects(filePaths) { // eslint-disable-line
        return new Promise((resolve, reject) => {
            let process = 1;
            const responseBody = [];
            Async.each(filePaths, (filePath) => {
                microsoftAzure.postFaceDetect(fs.createReadStream(filePath))
                    .then(async (result) => {
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

    start() {
        return new Promise(async (resolve, reject) => {
            // カメラ起動して複数枚写真をとる。
            const camera = new Camera(this.imageNum, this.imagePath);
            await camera.take();
            // 撮った写真の取得
            const files = await camera.readCarefullySelectedImageFiles()
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
            // // faceIdsをグルーピング
            const { groups } = await microsoftAzure.postFaceGroup(faceIds).catch((err) => {
                console.log(err);
            });
            // グルーピングしたものから適当な代表faceIdを決定しDBにインサート
            const saveImageFile = [];
            Async.each(groups, async (group) => {
                // 代表faceId
                const modelFaceId = group[Math.floor(Math.random() * group.length)];
                // 代表faceIdのdetect情報
                let detect = detects.filter((detect) => detect.result.find(face => (face.faceId === modelFaceId)));// eslint-disable-line
                if (detect instanceof Array) {
                    detect = detect[0]; // eslint-disable-line
                }
                const { result, filePath } = detect;
                // 保存しておく画像パスをpush
                saveImageFile.push(filePath);
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
            // 不要な画像ファイルを削除
            files.forEach((item) => {
                const isSave = saveImageFile.find(save => (item === save));
                if (isSave === undefined) {
                    fs.unlink(item, (err) => {
                        if (err) console.log(`${item}の削除に失敗`);
                    });
                }
            });
            resolve('success');
        });
    }
}
