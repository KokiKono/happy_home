/**
 * Created by kokikono on 2017/12/12.
 */
import PresentationModel from '../models/presentation';
import FamilyModel from '../models/family';
import * as ScenePatternConst from '../../ScenePatternConstant'

/**
 * スマホ操作アニメーション
 */
export const beginConfirmSmtartFhone = () => (
    new Promise(async (resolve, reject) => {
        try {
            const familyModel = new FamilyModel();
            const latestFamily = await familyModel.latestFamily()
                .catch(err => reject(err));
            const familyId = latestFamily[0].id;
            const presentationModel = new PresentationModel();
            const latestScene = await presentationModel.getLatestScene(familyId);
            await presentationModel
                .insertPattern(latestScene[0].id, ScenePatternConst.PHOTO_SMART_PHONE_CONFIRM);
            return resolve('success');
        } catch (err) {
            return reject(err);
        }
    })
)

/**
 * 帰宅前アニメーション
 */
export const beginComebackHome = () => (
    new Promise(async (resolve, reject) => {
        try {
            const familyModel = new FamilyModel();
            const latestFamily = await familyModel.latestFamily()
                .catch(err => reject(err));
            const familyId = latestFamily[0].id;
            const presentationModel = new PresentationModel();
            const latestScene = await presentationModel.getLatestScene(familyId);
            await presentationModel
                .insertPattern(latestScene[0].id, ScenePatternConst.ANIMATION_COMMON);
            return resolve('success');
        } catch (err) {
            return reject(err);
        }
    })
)

/**
 * 感情読み取り中画面
 */
export const beginEmotion = () => (
    new Promise(async (resolve, reject) => {
        try {
            const familyModel = new FamilyModel();
            const latestFamily = await familyModel.latestFamily()
                .catch(err => reject(err));
            const familyId = latestFamily[0].id;
            const presentationModel = new PresentationModel();
            const latestScene = await presentationModel.getLatestScene(familyId);
            await presentationModel
                .insertPattern(latestScene[0].id, ScenePatternConst.PHOTO_EMOTION_READING);
            return resolve('success');
        } catch (err) {
            return reject(err);
        }
    })
)

/**
 * ご飯アニメーション
 */
export const beginFamilyHeartstone = () => (
    new Promise(async (resolve, reject) => {
        try {
            const familyModel = new FamilyModel();
            const latestFamily = await familyModel.latestFamily()
                .catch(err => reject(err));
            const familyId = latestFamily[0].id;
            const presentationModel = new PresentationModel();
            const latestScene = await presentationModel.getLatestScene(familyId);
            await presentationModel
                .insertPattern(latestScene[0].id, ScenePatternConst.SCENE_FAMILY_HEARTHSTONE);
            return resolve('success');
        } catch (err) {
            return reject(err);
        }
    })
)

/**
 * 提案中アニメーション
 */
export const beginSuggestion = () => (
    new Promise(async (resolve, reject) => {
        try {
            const familyModel = new FamilyModel();
            const latestFamily = await familyModel.latestFamily()
                .catch(err => reject(err));
            const familyId = latestFamily[0].id;
            const presentationModel = new PresentationModel();
            const latestScene = await presentationModel.getLatestScene(familyId);
            await presentationModel
                .insertPattern(latestScene[0].id, ScenePatternConst.PHOTO_TEIAN_KUN);
            return resolve('success');
        } catch (err) {
            return reject(err);
        }
    })
)

export const beginClean = () => (
    new Promise(async (resolve, reject) => {
        try {
            const familyModel = new FamilyModel();
            const latestFamily = await familyModel.latestFamily()
                .catch(err => reject(err));
            const familyId = latestFamily[0].id;
            const presentationModel = new PresentationModel();
            const latestScene = await presentationModel.getLatestScene(familyId);
            await presentationModel
                .insertPattern(latestScene[0].id, ScenePatternConst.CLEAN);
            return resolve('success');
        } catch (err) {
            return reject(err);
        }
    })
)

export const beginCreateFamily = () => (
    new Promise(async (resolve, reject) => {
        try {
            const familyModel = new FamilyModel();
            const latestFamily = await familyModel.latestFamily()
                .catch(err => reject(err));
            const familyId = latestFamily[0].id;
            const presentationModel = new PresentationModel();
            const latestScene = await presentationModel.getLatestScene(familyId);
            await presentationModel
                .insertPattern(latestScene[0].id, ScenePatternConst.CREATE_FAMILY);
            return resolve('success');
        } catch (err) {
            return reject(err);
        }
    })
)

