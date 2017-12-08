/**
 * Created by kokikono on 2017/11/12.
 */
import mysql from 'mysql';

export default class Emotion {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'happy_home',
        });
    }

    getLatestEmotions(familyId) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'SELECT * FROM t_emotion WHERE family_id = ?',
                [familyId],
                (queryErr, results) => {
                    if (queryErr) reject(queryErr);
                    resolve(results);
                },
            );
        });
    }

    getEmotionIndividuals(emotionId) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'SELECT * FROM t_emotion_individual WHERE emotion_id = ?',
                [emotionId],
                (queryErr, results) => {
                    if (queryErr) reject(queryErr);
                    resolve(results);
                },
            );
        });
    }

    getLatestEmotionsWidthFaceId(familyId) {
        return new Promise(async (resolve, reject) => {
            const modelEmotions = [];
            const latestEmotions = await this.getLatestEmotions(familyId)
                .catch(err => reject(err));
            await Promise.all(latestEmotions.map(async (latestEmotion) => {
                const emotions = await this.getEmotionIndividuals(latestEmotion.id)
                    .catch(err => reject(err));
                emotions.forEach((emotion) => {
                    // すでにmodelEmotionsにfaceIdが入っているかを検索
                    const findEmotion = modelEmotions
                        .find(element => element.face_id === emotion.face_id);
                    // すでに入っている場合はjsonDataListにpush
                    if (findEmotion) {
                        modelEmotions[modelEmotions.indexOf(findEmotion)]
                            .jsonDataList.push(JSON.parse(emotion.json_data));
                        return;
                    }
                    modelEmotions.push({
                        face_id: emotion.face_id,
                        jsonDataList: [JSON.parse(emotion.json_data)],
                    });
                });
            }));
            resolve(modelEmotions);
        });
    }

    getLatestEmotionsSumTotalWidthFaceId(familyId) {
        return new Promise(async (resolve, reject) => {
            const result = [];
            const latestEmotionsWidthFaceIds = await this.getLatestEmotionsWidthFaceId(familyId)
                .catch(err => reject(err));
            latestEmotionsWidthFaceIds.forEach((latestEmotionsWidthFaceId) => {
                const jsonDataKeyLength = {};
                const resultJsonData = {};
                latestEmotionsWidthFaceId.jsonDataList.forEach((jsonData) => {
                    const { scores } = jsonData.emotion;
                    const jsonDataKeys = Object.keys(jsonDataKeyLength);
                    Object.keys(scores).forEach((scoreKey) => {
                        if (jsonDataKeys.indexOf(scoreKey) > 0) {
                            resultJsonData[scoreKey] += scores[scoreKey];
                            jsonDataKeyLength[scoreKey] += 1;
                            return true;
                        }
                        resultJsonData[scoreKey] = scores[scoreKey];
                        jsonDataKeyLength[scoreKey] = 1;
                    });
                });
                result.push({
                    face_id: latestEmotionsWidthFaceId.face_id,
                    emotion: resultJsonData,
                    jsonDataKeyLength,
                });
            });
            resolve(result);
        });
    }

    getLatestEmotionAVGWidthFaceId(familyId) {
        return new Promise(async (resolve, reject) => {
            const LESTwidthFaceIds =
                await this.getLatestEmotionsSumTotalWidthFaceId(familyId)
                .catch(err => reject(err));
            const result = [];
            LESTwidthFaceIds.forEach((LESTwidthFaceId) => {
                const resultItem = {
                    face_id: LESTwidthFaceId.face_id,
                    emotion: {},
                };
                const { emotion, jsonDataKeyLength } = LESTwidthFaceId;
                Object.keys(LESTwidthFaceId.emotion)
                    .forEach((emotionKey) => {
                        resultItem.emotion[emotionKey] =
                            emotion[emotionKey] / jsonDataKeyLength[emotionKey];
                        return true;
                    });
                result.push(resultItem);
            });
            resolve(result);
        });
    }
}

