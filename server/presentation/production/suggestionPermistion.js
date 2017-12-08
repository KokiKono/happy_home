/**
 * Created by kokikono on 2017/11/22.
 */
import FamilyModel from '../models/family';
import SuggestionPermission from '../models/suggestionPermision';
import EmotionModel from '../models/emotion';
import PresentationModel from '../models/presentation';

const run = () => (
    new Promise(async (resolve, reject) => {
        try {
            const familyModel = new FamilyModel();
            const latestFamily = await familyModel.latestFamily();
            const familyStructures = await familyModel.getFamilyStructre(latestFamily[0].id);
            // 現在家族のタイプをすべて取得
            const familyTypes = [];
            familyStructures.forEach(item => familyTypes.push(item.type));
            console.log(familyTypes)
            // 現在家族タイプにあったfrom_typeの提案を取得
            const suggestionPermission = new SuggestionPermission();
            const suggestions = await suggestionPermission.getSuggestionAll();
            const modelSuggestions = [];
            suggestions.forEach((item) => {
                if (item.from_type === 'ALL') {
                    modelSuggestions.push(item);
                    return;
                }
                if (familyTypes.indexOf(item.from_type) >= 0) {
                    modelSuggestions.push(item);
                }
            });
            // 提案判断取得
            const suggestionJudgments = [];
            await Promise.all(modelSuggestions.map(async (item) => {
                const judgments = await suggestionPermission.getJudgmentAll(item.id);
                if (judgments.length === 0) return null;
                suggestionJudgments.push({
                    suggestion: item,
                    judgments,
                });
                return true;
            }));
            // 最新家族感情と近い提案判断を決定
            // 最新感情取得
            const emotionModel = new EmotionModel();
            // 最新感情情報の平均値
            const modelEmotions =
                await emotionModel.getLatestEmotionAVGWidthFaceId(latestFamily[0].id);
            // 提案許可処理
            // 提案許可リスト
            const modelPermissions = [];
            // 提案許可を判断するロジックは、現在の感情総和と近さが一定ギャップのものを取得する。
            // 提案判断と感情総和とのギャップ
            const ejFar = 0;
            suggestionJudgments.forEach((item) => {
                console.log(`----------提案id=${item.suggestion.id}、type=${item.suggestion.type}を提案許可できるか判断します。--------`);
                const fromType = item.suggestion.from_type;
                if (fromType === 'ALL') {
                    console.log('提案対象元タイプはALLなので、家族感情全員を見ます。');
                    let isOKNum = 0;
                    familyStructures.forEach((familyStructure) => {
                        // 感情取得
                        const modelEmotion = modelEmotions
                            .find(element => element.face_id === familyStructure.face_id);
                        // 感情取得失敗
                        if (!modelEmotion) return;
                        // 感情と提案判断の比較
                        console.log(`>>>>>>>${familyStructure.type}での提案許可処理開始<<<<<<<`);
                        let isPermission = false;
                        item.judgments.forEach((judgment) => {
                            const findScoreIndex = Object.keys(modelEmotion.emotion)
                                .indexOf(judgment.key_name);
                            if (findScoreIndex === -1) return;
                            const diffEmotion =
                                Math.abs(modelEmotion.emotion[judgment.key_name] - judgment.val);

                            console.log(`> ${judgment.key_name}を比較します。`);
                            console.log(`> > 感情平均:${modelEmotion.emotion[judgment.key_name]} - 判断:${judgment.val} = ${diffEmotion}`);
                            isPermission = diffEmotion >= ejFar;
                        });
                        console.log(`>>>>>>${familyStructure.type}において提案は${isPermission ? '許可' : '却下'}されました。<<<<<<`);
                        if (isPermission) isOKNum += 1;
                    });
                    const isOK = isOKNum === familyStructures.length;
                    console.log(`~~~~~~~~~~${familyStructures.length}人家族では最終的に${isOK ? '許可' : '却下'}されました。~~~~~~~~`);
                    modelPermissions.push(item);
                    return;
                }
                // face_idとfrom_typeの結合
                const fromFamilyStructure =
                    familyStructures.find(element => fromType === element.type);
                if (fromFamilyStructure === undefined) {
                    console.log('fromFamilyStructure取得失敗');
                    return;
                }
                const modelEmotion = modelEmotions
                    .find(element => element.face_id === fromFamilyStructure.face_id);
                if (modelEmotion === undefined) {
                    console.log('modelEmotion取得失敗');
                    return;
                }

                // 現在感情と提案判断の比較
                let isPermission = false;
                item.judgments.forEach((judgment) => {
                    const emotionKeyIndex = Object.keys(modelEmotion.emotion)
                        .indexOf(judgment.key_name);
                    if (emotionKeyIndex === -1) return;
                    // 差分比較
                    const diffEmotion =
                        Math.abs(modelEmotion.emotion[judgment.key_name] - judgment.val);
                    console.log(`> ${judgment.key_name}を比較します。`);
                    console.log(`> > 感情平均:${modelEmotion.emotion[judgment.key_name]} - 判断:${judgment.val} = ${diffEmotion}`);
                    isPermission = diffEmotion >= ejFar;
                });
                console.log(`>>>>>>${fromFamilyStructure.type}において提案は${isPermission ? '許可' : '却下'}されました。<<<<<<`);
                if (isPermission) modelPermissions.push(item);
            });
            console.log(`提案許可された数:${modelPermissions.length}`);
            const presentationModel = new PresentationModel();
            const latestScene = await presentationModel.getLatestScene(latestFamily[0].id);
            const latestPattern = await presentationModel.getLatestPattern(latestScene[0].id);
            await Promise.all(modelPermissions.map(async (item) => {
                await suggestionPermission
                    .insertPermistion(latestPattern[0].id, item.suggestion.id);
            }));
            return resolve('success');
        } catch (err) {
            return reject(err);
        }
    })
);

export default run;
