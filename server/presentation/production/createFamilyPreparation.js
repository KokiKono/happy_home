/**
 * 家族構成前準備を行う。
 * Created by kokikono on 2017/11/08.
 */
import * as fs from 'fs';
import Async from 'async';
import sharp from 'sharp';
import * as path from 'path';
import oxford from 'project-oxford';
// import oxford from '../mock/project-oxford';

import configFile from '../../../config.json';
import Camera from '../../ai/camera';
import TmpFaceDao from '../models/tmpFace';

export default class createFamilyPreparation {
    constructor(imageNum, imagePath) {
        this.imageNum = imageNum;
        this.imagePath = imagePath;
    }

    start() {
        return new Promise(async (resolve, reject) => {
            // MicroSoft Azure API Client
            const faceClient = new oxford.Client(configFile['api-key'].faceAPI, configFile.azureApi.region.faceAPI);
            // カメラ起動して複数枚写真をとる。
            const camera = new Camera(this.imageNum, this.imagePath);
            await camera.take();
            // 撮った写真の取得
            const files = await camera.readCarefullySelectedImageFiles()
                .catch((err) => { reject(err); });
            // 撮った写真をfaceAPIに投げる
            const detects = await camera.postFaceAPIDetects(faceClient.face.detect, files)
                .catch((err) => { reject(err); });
            // faceListからfaceIdを抽出
            const faceIds = [];
            Async.each(detects, (detect) => {
                Async.each(detect.result, (face) => {
                    faceIds.push(face.faceId);
                });
            });
            // faceIdsをグルーピング
            const { groups } = await faceClient.face.grouping(faceIds)
                .catch((err) => {
                    console.log('グルーピング失敗', err);
                });
            // グルーピングしたものから適当な代表faceIdを決定しDBにインサート
            const saveImageFile = [];
            Async.each(groups, async (group) => {
                // 代表faceId
                const modelFaceId = group[Math.floor(Math.random() * group.length)];
                // 代表faceIdのdetect情報
                const detect = Camera.findDetects(modelFaceId, detects);
                const { result, filePath } = detect;
                const faceImagePath = path.join(__dirname, `../../views/public/images/${modelFaceId}.jpeg`);
                console.log(faceImagePath);
                // 顔ファイルを作成
                sharp(filePath)
                    .extract(result.faceRectangle)
                    .toFile(faceImagePath, (err) => {
                        if (err) console.log('顔ファイル作成失敗', err);
                    });
                // 保存しておく画像パスをpush
                saveImageFile.push(filePath);
                // faceGroup情報をDBにインサート
                const tmpFaceDao = new TmpFaceDao();
                await tmpFaceDao.insertRelation(modelFaceId, faceImagePath, JSON.stringify(result))
                    .then((results) => {
                        Async.each(group, async (item) => {
                            const tmpFaceDao2 = new TmpFaceDao();
                            await tmpFaceDao2.insertGroup(results.insertId, item);
                        });
                    }).catch((err) => {
                    console.log(err);
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
