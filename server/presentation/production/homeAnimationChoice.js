/**
 * 家内アニメーション選択処理に関する関数
 * Created by kokikono on 2017/11/07.
 */
import PresentationModel from '../models/presentation';
import FamilyModel from '../models/family';
import EmotionModel from '../models/emotion';
import * as ScenePatternContant from '../../ScenePatternConstant';

const animation = () => (
    new Promise(async (resolve, reject) => {
        try {
            // 家族情報の取得
            const familyModel = new FamilyModel();
            const latestFamily = await familyModel.latestFamily();
            const familyId = latestFamily[0].id;
            // 留守シーンの場合はパターン1を入れて終了
            const presentationModel = new PresentationModel();
            const latestScene = await presentationModel.getLatestScene(familyId);
            if (latestScene[0].scene === 1) {
                // 留守シーンなので、パターンをいれて終了
                await presentationModel
                    .insertPattern(
                        latestScene[0].scene,
                        ScenePatternContant.SCENE_ABSENCE_RETURN_HOME,
                    )
                    .catch(err => reject(err));
                return resolve('out_scene');
            }
            const familyStructure = await familyModel.getFamilyStructre(familyId)
                .catch(err => reject(err));
            // 母の家族情報の取得
            const motherInfo = familyStructure.find(element => element.type === '母');
            if (!motherInfo) {
                console.log('母がいないので怒っているシーンにします。');
                await presentationModel
                    .insertPattern(
                        latestScene[0].id,
                        ScenePatternContant.SCENE_FAMILY_RETURN_HOME_ANGRY,
                    );
                // 母がいない場合は怒っているシーンにする。
                return resolve('mom_oko');
            }
            // 最新感情データを取得
            const emotionModel = new EmotionModel();
            const latestEmotionAVG = await emotionModel.getLatestEmotionAVGWidthFaceId(familyId);
            // 母の感情データの取得
            const motherEmotion = latestEmotionAVG
                .find(element => element.face_id === motherInfo.face_id);
            // 母の怒り感情の比較 怒っているシーンにし易いように、怒り + 軽蔑 + 通常を判断する。
            if ((motherEmotion.emotion.anger + motherEmotion.emotion.contempt + motherEmotion.emotion.neutral) > 0.5) {
                console.log('母が怒っています。');
                // 母おこなので、パターン2をいれて終了。
                await presentationModel
                    .insertPattern(
                        latestScene[0].id,
                        ScenePatternContant.SCENE_FAMILY_RETURN_HOME_ANGRY,
                    );
                return resolve('mom_oko');
            }
            // 母喜びなので、パターン1をいれて終了。
            console.log('母は怒っていません。');
            await presentationModel
                .insertPattern(latestScene[0].id, ScenePatternContant.SCENE_FAMILY_RETURN_HOME_JOY);
            return resolve('mom_happy');
        } catch (err) {
            console.error(err)
            return reject(err);
        }
    })
);
export default animation;
