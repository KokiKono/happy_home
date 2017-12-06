/**
 * Created by kokikono on 2017/11/22.
 */
import FamilyModel from '../models/family';
import SuggestionPermission from '../models/suggestionPermision';
import EmotionModel from '../models/emotion';
import PresentationModel from '../models/presentation';

const run = () => {
    return new Promise(async (resolve, reject) => {
        const familyModel = new FamilyModel();
        const latestFamily = await familyModel.latestFamily();
        const familyStructure = await familyModel.getFamilyStructre(latestFamily[0].id);
        // 現在家族のタイプをすべて取得
        const familyTypes = [];
        familyStructure.forEach(item => familyTypes.push(item.type));
        console.log(familyTypes)
        // 現在家族タイプにあったfrom_typeの提案を取得
        const suggestionPermission = new SuggestionPermission();
        const suggestions = await suggestionPermission.getSuggestionAll();
        const modelSuggestions = [];
        suggestions.forEach((item) => {
            if (item.from_type === 'ALL') {
                return modelSuggestions.push(item);
            }
            if (familyTypes.indexOf(item.from_type) >= 0) {
                return modelSuggestions.push(item);
            }
        });
        // 提案判断取得
        const suggestionJudgments = [];
        await Promise.all(modelSuggestions.map(async (item) => {
            const judgments = await suggestionPermission.getJudgmentAll(item.id)
                .catch(err => console.log(err));
            if (judgments.length === 0) return null;
            suggestionJudgments.push({
                suggestion: item,
                judgments,
            });
        }));
        // 最新家族感情と近い提案判断を決定
        // 最新感情取得
        const emotionModel = new EmotionModel();
        const latestEmotions = await emotionModel.getLatestEmotions(latestFamily[0].id);
        // 個別感情テーブルの総和
        const modelEmotions = [];
        // 一時感情
        const tmpEmotions = [];
        await Promise.all(latestEmotions.map(async (item) => {
            const emotions = await emotionModel.getEmotionIndividuals(item.id);
            emotions.forEach((emotion) => {
                // すでにfaceIdがtmpEmotionsにはいっているか検索する
                const findEmotion = tmpEmotions.find((tmp) => {
                    if (tmp.face_id === emotion.face_id) return true;
                    return false;
                });
                // console.log(tmpIndex);
                if (findEmotion) {
                    tmpEmotions[tmpEmotions.indexOf(findEmotion)]
                        .jsonDataList.push(emotion.json_data);
                    return;
                }
                tmpEmotions.push({
                    face_id: emotion.face_id,
                    jsonDataList: [emotion.json_data],
                });
            });
        }));
        // console.log(tmpEmotions);
        // faceIdごとに合算する
        tmpEmotions.forEach((tmpEmotion) => {
            const modelJsonData = {};
            tmpEmotion.jsonDataList.forEach((strJson) => {
                const jsonData = JSON.parse(strJson);
                const jsonEmotion = jsonData.emotion.scores;
                const jsonDataKeys = Object.keys(jsonEmotion);
                const modelJSONDataKeys = Object.keys(modelJsonData);
                // console.log(jsonDataKeys)
                jsonDataKeys.forEach((key) => {
                    // console.log(modelJSONDataKeys.indexOf(key));
                    if (modelJSONDataKeys.indexOf(key) === -1) {
                        // modelJsonData = Object.assign(modelJsonData, jsonEmotion[key]);
                        // console.log(key)
                        modelJsonData[key] = jsonEmotion[key];
                    } else {
                        // console.log(modelJSONDataKeys.indexOf(key));
                        modelJsonData[key] += jsonEmotion[key];
                    }
                    // console.log('modelJsonData',modelJsonData)
                });
            });
            modelEmotions.push({
                face_id: tmpEmotion.face_id,
                emotion: modelJsonData,
            });
        });
        // console.log(modelEmotions);
        // 提案許可処理
        // 提案許可リスト
        const modelPermissions = [];
        // 提案許可を判断するロジックは、現在の感情総和と近さが一定ギャップのものを取得する。
        // 提案判断と感情総和とのギャップ
        const ejFar = 0;
        suggestionJudgments.forEach((item) => {
            const fromType = item.suggestion.from_type;
            if (fromType === 'ALL') return;
            // face_idとfrom_typeの結合
            const fromFamilyStructure = familyStructure.find(element => fromType === element.type);
            if (fromFamilyStructure === undefined) {
                console.log('fromFamilyStructure取得失敗');
                return;
            }
            const modelEmotion = modelEmotions.find(element => element.face_id === fromFamilyStructure.face_id);
            if (modelEmotion === undefined) {
                console.log('modelEmotion取得失敗');
                return;
            }
            // 現在感情と提案判断の比較
            item.judgments.forEach((judgment) => {
                const emotionKeyIndex = Object.keys(modelEmotion.emotion).indexOf(judgment.key_name);
                if (emotionKeyIndex === -1) return;
                // 差分比較
                const diffEmotion = modelEmotion.emotion[judgment.key_name] - judgment.val;
                console.log(`-------比較スタート--------${item.suggestion.id}`);
                console.log(`${judgment.key_name}を比較します。`);
                console.log(`感情総和:${modelEmotion.emotion[judgment.key_name]} - 判断:${judgment.val} = ${diffEmotion}`);
                console.log(`提案は${diffEmotion} >= ${ejFar} で${diffEmotion >= ejFar ? '許可' : '却下'}されました。`);
                if (diffEmotion >= ejFar) {
                    modelPermissions.push(item);
                }
            });
        });
        console.log(`提案許可された数:${modelPermissions.length}`);
        const presentationModel = new PresentationModel();
        const latestScene = await presentationModel.getLatestScene(latestFamily[0].id);
        const latestPattern = await presentationModel.getLatestPattern(latestScene[0].id);
        await Promise.all(modelPermissions.map(async (item) => {
            await suggestionPermission.insertPermistion(latestPattern[0].id, item.suggestion.id);
        }));
        resolve('success');
    });
}
run();
