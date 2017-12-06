/**
 * 感情読み取りを行うファイル
 * Created by kokikono on 2017/11/12.
 */
import Async from 'async';

import oxford from 'project-oxford';
// import oxford from '../mock/project-oxford';
import configFile from '../../../config.json';
import Camera from '../../ai/camera';
import FamilyDao from '../models/family';


export default class Emotion {
    /**
     * 複数枚の写真を撮りそれぞれのemotion情報を取得する。
     * @param imageNum
     */
    constructor(imageNum, imagePath) {
        this.imageNum = imageNum;
        this.imagePath = imagePath;
    }

    /**
     * t_emotionsに格納しながらinsertIdを付加する。
     * @param emotions
     * @returns {Promise}
     */
    insertEmotions(familyDao, familyId, emotions) {
        return new Promise((resolve) => {
            let process = 1;
            const responseBody = [];
            emotions.forEach(async (emotion) => {
                const emotionId = await familyDao
                    .insertEmotion(familyId, JSON.stringify(emotion.result), emotion.filePath)
                    .catch(err => console.log(err));
                process += 1;
                const emotionDetailList = [];
                Async.each(emotion.result, (item) => {
                    emotionDetailList.push({
                        emotion: item,
                        emotionId,
                    });
                });
                responseBody.push(emotionDetailList);
                if (process === emotions.length) {
                    resolve(responseBody);
                }
            });
        });
    }
    start() {
        return new Promise(async (resolve, reject) => {
            const familyDao = new FamilyDao();
            const latestFamily = await familyDao.latestFamily().catch(err => reject(err));
            const familyId = latestFamily[0].id;
            console.log(`emotion start family id is ${familyId}`);
            // MicroSoft Azure API Client
            const faceClient = new oxford.Client(configFile['api-key'].faceAPI, configFile.azureApi.region.faceAPI);
            const emotionClient = new oxford.Client(configFile['api-key'].emotionAPI, configFile.azureApi.region.emotionAPI);
            // カメラを起動して複数枚写真を撮る。
            const camera = new Camera(this.imageNum, this.imagePath);
            await camera.take();
            // 撮った写真の取得
            const files = await camera.readCarefullySelectedImageFiles();
            // 撮った写真をfaceAPIに投げる。
            const detects = await camera.postFaceAPIDetects(faceClient.face.detect, files)
                .catch(err => console.log(err));
            // faceLIstからfaceIdを抽出する
            const faceIds = [];
            Async.each(detects, (detect) => {
                Async.each(detect.result, (face) => {
                    faceIds.push(face.faceId);
                });
            });
            // faceIdsをグルーピング
            const { groups } = await faceClient.face.grouping(faceIds).catch((err) => {
                console.log(`emotion情報のfaceIds ${err}`);
                console.log(faceIds)
                reject(err);
            });
            // filesをemotionAPIに投げる。
            const emotions = await camera.postEmotionAPI(emotionClient.emotion.analyzeEmotion, files)
                .catch((err) => { reject(err); });
            // emotionをDBにインサート
            const emotionList = await this.insertEmotions(familyDao, familyId, emotions);
            // groupsを元にdetectとemotionを結合
            const emotionDetectGroupList = [];
            Async.each(groups, (group) => {
                const emotionDetectGroup = [];
                Async.each(group, (faceId, next) => {
                    const { result, filePath } = Camera.findDetects(faceId, detects);
                    const partsEmotion = Camera.findEmotion(emotionList, result.faceRectangle);
                    if (partsEmotion === undefined) {
                        console.log('emotionとdetectの結合に失敗');
                        next();
                    }
                    emotionDetectGroup.push({ detect: result, emotion: partsEmotion, filePath });
                });
                emotionDetectGroupList.push(emotionDetectGroup);
            });
            // DBに保存されている代表faceIdと同一人物性を比較し、一番近いものを代表faceIdとする。

            // DBに保存している代表faceIdsを取得
            const modelFaceIds = await familyDao.getModelFamily(familyId);
            Async.each(emotionDetectGroupList, async (emotionDetectGroup) => {
                const comparisonFaceId = emotionDetectGroup[0].detect.faceId;
                const findSimilarList = await faceClient
                    .face.similar(comparisonFaceId, { candidateFaces: modelFaceIds })
                    .catch(err => reject(err));
                const most = await Camera.mostFindSimilar(findSimilarList);
                Async.each(emotionDetectGroup, async (emotionDetect) => {
                    // const familyDao2 = new FamilyDao();
                    await familyDao.insertindividual(
                        emotionDetect.emotion.emotionId,
                        JSON.stringify(emotionDetect.emotion),
                        most.faceId,
                    ).catch((err) => {
                        console.log('個別感情テーブルインサートエラー', err);
                    });
                });
            });
        });
    }
};