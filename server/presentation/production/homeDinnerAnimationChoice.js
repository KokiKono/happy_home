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
            // 留守シーンの場合は父の感情を見て、判定
            const presentationModel = new PresentationModel();
            const latestScene = await presentationModel.getLatestScene(familyId);
            const familyStructure = await familyModel.getFamilyStructre(familyId)
                .catch(err => reject(err));
            const emotionModel = new EmotionModel();
            const latestEmotionAVG = await emotionModel.getLatestEmotionAVGWidthFaceId(familyId);
            if (latestScene[0].scene === 1) {
                // 留守シーン
                const fatherInfo = familyStructure.find(element => element.type === '父');
                if (!fatherInfo) {
                    // 父がいないので、寂しいにする。
                    await presentationModel
                        .insertPattern(
                            latestScene[0].scene,
                            ScenePatternContant.SCENE_ABSENCE_RONELY,
                        )
                        .catch(err => reject(err));
                    return resolve('father_ronely');
                }
                // 父の感情情報を見る。
                const fatherEmotion = latestEmotionAVG
                    .find(element => element.face_id === fatherInfo.face_id);
                if ((fatherEmotion.emotion.sadness) > 0.5) {
                    console.log('父が寂しがっています。');
                    // 父の留守寂しいを入れて終了
                    await presentationModel
                        .insertPattern(
                            latestScene[0].id,
                            ScenePatternContant.SCENE_ABSENCE_RONELY,
                        );
                    return resolve('father_ronely');
                } else if (fatherEmotion.emotion.happiness > 0.5){
                    console.log('父が幸せです。')
                    // 父しあわせを入れて終了
                    await presentationModel
                        .insertPattern(
                            latestScene[0].id,
                            ScenePatternContant.SCENE_ABSENCE_HAPPINESS,
                        );
                    return resolve('father_happy');
                } else {
                    console.log('父が疲れてます。');
                    // 父しあわせを入れて終了
                    await presentationModel
                        .insertPattern(
                            latestScene[0].id,
                            ScenePatternContant.SCENE_ABSENCE_TRIED,
                        );
                    return resolve('father_tried');
                }
            } else {
                // 家族シーンでは、家族全員の感情を見て判断
                let allHappyAVG = 0;
                latestEmotionAVG.forEach((element) => allHappyAVG += element.emotion.happiness);
                allHappyAVG = allHappyAVG / familyStructure.length;
                if (allHappyAVG > 0.5) {
                    // 家族幸せシーンを入れて終了
                    await presentationModel
                        .insertPattern(
                            latestScene[0].id,
                            ScenePatternContant.SCENE_FAMILY_HEARTHSTONE,
                        );
                    return resolve('family_hearthstone');
                } else {
                    await presentationModel
                        .insertPattern(
                            latestScene[0].id,
                            ScenePatternContant.SCENE_FAMILY_SILENCE,
                        );
                    return resolve('family_silence');
                }
            }
        } catch (err) {
            console.error(err);
            return reject(err);
        }
    })
);
export default animation;
