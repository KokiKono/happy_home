/**
 * 家内アニメーション選択処理に関する関数
 * Created by kokikono on 2017/11/07.
 */
import PresentationModel from '../models/presentation';
import FamilyModel from '../models/family';
import EmotionModel from '../models/emotion';

const animation = () => { // eslint-disable-line
    return new Promise(async (resolve, reject) => {
        // 家族情報の取得
        const familyModel = new FamilyModel();
        const latestFamily = await familyModel.latestFamily()
            .catch(err => reject(err));
        const familyId = latestFamily[0].id;
        // 留守シーンの場合はパターン1を入れて終了
        const presentationModel = new PresentationModel();
        const latestScene = await presentationModel.getLatestScene(familyId);
        if (latestScene[0].scene === 1) {
            // 留守シーンなので、パターンをいれて終了
            await presentationModel.insertPattern(latestScene[0].scene, 0)
                .catch(err => reject(err));
            return resolve('success');
        }
        const familyStructure = await familyModel.getFamilyStructre(familyId)
            .catch(err => reject(err));
        // 母の家族情報の取得
        const motherInfo = familyStructure.find(element => element.type === '父');
        if (!motherInfo) {
            // 母がいない場合は怒っているシーンにする。
            return resolve('success');
        }
        // 最新感情データを取得
        const emotionModel = new EmotionModel();
        const latestEmotionAVG = await emotionModel.getLatestEmotionAVGWidthFaceId(familyId)
            .catch(err => reject(err));
        // 母の感情データの取得
        const motherEmotion = latestEmotionAVG
            .find(element => element.face_id === motherInfo.face_id);
        // 母の怒り感情の比較
        if (motherEmotion.emotion.anger > 0.5) {
            // 母おこなので、パターン2をいれて終了。
            await presentationModel.insertPattern(latestScene[0].id, 2)
                .catch(err => reject(err));
            return resolve('success');
        }
        // 母喜びなので、パターン1をいれて終了。
        await presentationModel.insertPattern(latestScene[0].id, 1)
            .catch(err => reject(err));
        return resolve('success');
    });
};

export default animation;