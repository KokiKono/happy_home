/**
 * Created by kokikono on 2017/12/01.
 */
import FamilyModel from '../models/family';
import EmotionModel from '../models/emotion';
import * as path from 'path';

const run = async (app) => {
    try {
        const familyModel = new FamilyModel();
        const latestFamily = await familyModel.latestFamily();
        // 最新感情取得
        const emotionModel = new EmotionModel();
        const latestEmotions = await emotionModel.getLatestEmotions(latestFamily[0].id);
        // // console.log(latestEmotions[0])
        // // 個別感情テーブルの総和
        // const modelEmotions = [];
        // // 一時感情
        // const tmpEmotions = [];
        // await Promise.all(latestEmotions.map(async (item) => {
        //     const emotions = await emotionModel.getEmotionIndividuals(item.id);
        //     emotions.forEach((emotion) => {
        //         // すでにfaceIdがtmpEmotionsにはいっているか検索する
        //         const findEmotion = tmpEmotions.find((tmp) => {
        //             if (tmp.face_id === emotion.face_id) return true;
        //             return false;
        //         });
        //         // console.log(tmpIndex);
        //         if (findEmotion) {
        //             tmpEmotions[tmpEmotions.indexOf(findEmotion)]
        //                 .jsonDataList.push(emotion.json_data);
        //             return;
        //         }
        //         tmpEmotions.push({
        //             face_id: emotion.face_id,
        //             jsonDataList: [emotion.json_data],
        //         });
        //     });
        // }));
        // // console.log(tmpEmotions);
        // // faceIdごとに合算する
        // tmpEmotions.forEach((tmpEmotion) => {
        //     const modelJsonData = {};
        //     const modelJsonDataKeysLength = {};
        //     tmpEmotion.jsonDataList.forEach((strJson) => {
        //         const jsonData = JSON.parse(strJson);
        //         const jsonEmotion = jsonData.emotion.scores;
        //         const jsonDataKeys = Object.keys(jsonEmotion);
        //         const modelJSONDataKeys = Object.keys(modelJsonData);
        //         // console.log(jsonDataKeys)
        //         jsonDataKeys.forEach((key) => {
        //             // console.log(modelJSONDataKeys.indexOf(key));
        //             if (modelJSONDataKeys.indexOf(key) === -1) {
        //                 // modelJsonData = Object.assign(modelJsonData, jsonEmotion[key]);
        //                 // console.log(key)
        //                 modelJsonData[key] = jsonEmotion[key];
        //                 modelJsonDataKeysLength[key] = 1;
        //             } else {
        //                 // console.log(modelJSONDataKeys.indexOf(key));
        //                 modelJsonData[key] += jsonEmotion[key];
        //                 modelJsonDataKeysLength[key] += 1;
        //             }
        //             // console.log('modelJsonData',modelJsonData)
        //         });
        //     });
        //     // avg 処理
        //     Object.keys(modelJsonData)
        //         .forEach((element) => {
        //             modelJsonData[element] /= modelJsonDataKeysLength[element];
        //             return true;
        //         });
        //     modelEmotions.push({
        //         face_id: tmpEmotion.face_id,
        //         emotion: modelJsonData,
        //         modelJsonDataKeysLength,
        //     });
        // });
        const modelEmotions = await emotionModel.getLatestEmotionAVGWidthFaceId(latestFamily[0].id);
        // ソケットで飛ばすデータ
        const socketGrafData = {};
        const socketImagedata = [];
        // 家族構成ごとの感情データの取得
        const familyStructure = await familyModel.getFamilyStructre(latestFamily[0].id);
        Promise.all(familyStructure.map((item) => {
            const emotion = modelEmotions.find(element => element.face_id === item.face_id);
            socketGrafData[item.name] = emotion.emotion.happiness * 100;
            const imageData = [];
            imageData.push(item.name);
            Object.keys(emotion.emotion).forEach((element) => {
                imageData.push(emotion.emotion[element]);
            });
            socketImagedata.push(imageData);
            return true;
        }));
        socketGrafData['幸せ指数'] = 10;// 仮

        // setInterval(() => {
        //     app.socket.io.emit('graph update', socketGrafData);
        //     app.socket.io.emit('image update', `../public/images/${path.basename(latestEmotions[0].image_path)}`, socketImagedata);
        // }, 5000)
        app.socket.io.emit('graph update', socketGrafData);
        app.socket.io.emit('image update', `../public/images/${path.basename(latestEmotions[0].image_path)}`, socketImagedata);
        return 'emotion socket success';
    } catch (err) {
        return err;
    }
}

export default run;
