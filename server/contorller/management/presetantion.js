/**
 * Created by kokikono on 2017/12/15.
 */
import * as path from 'path';
import TmpFace from '../../presentation/models/tmpFace';
import CreateFamilyPreparation from '../../presentation/production/createFamilyPreparation';
import createFamily from '../../presentation/production/createFamily';
import scene from '../../presentation/production/scene';
import Emotion from '../../presentation/production/emotion';
import emotionSocket from '../../presentation/production/emotionSocket';
import homeAnimationChoice from '../../presentation/production/homeAnimationChoice';
import utilAnimation from '../../presentation/production/utilAnimation';
import * as beginAnimation from '../../presentation/production/beginAnimation';
import suggestionPermission from '../../presentation/production/suggestionPermistion';
import Suggestion from '../../presentation/production/suggestion';

import FamilyModel from '../../presentation/models/family';
import Presentation from '../../presentation/models/presentation';

let renderId = '';
exports.indexParam = async (req, res, next) => {
    if (!req.param('id')) return next();
    const id = req.param('id');
    console.log(`id=${id}`);
    switch (id) {
        case '0': {
            console.log('クリーン処理');
            const tmpFace = new TmpFace();
            await tmpFace.deleteAll().catch(e => console.error(e));
            renderId = 'clean';
            return next();
        }
        case '1': {
            console.log('家族作成前準備');
            const createFamilyPreparation = new CreateFamilyPreparation(10, path.join(__dirname, '../../views/public/images/'));
            createFamilyPreparation.start()
                .then(s => console.log(s))
                .catch(e => console.error(e));
            renderId = 'create_family_preparation';
            return next();
        }
        case '2': {
            console.log('家族作成');
            createFamily({ socket: req.socket }).then(s => console.log(s))
                .catch(e => console.error(e));
            renderId = 'create_family';
            return next();
        }
        default: return next();
    }
}
exports.index = (req, res) => {
    res.render('management/presentation/index', { id: renderId }); // eslint-disable-line
}

exports.scene = async (req, res, next) => {
    const familyModel = new FamilyModel();
    const latestFamily = await familyModel.latestFamily()
        .catch(e => console.error(e));
    const presentationModel = new Presentation();
    const latestScene = await presentationModel.getLatestScene(latestFamily[0].id)
        .catch(e => console.error(e));
    if (latestScene.length === 0) {
        const err = new Error('シーンが選択されていません。');
        next(err);
    }
    if (latestScene[0].scene === 0) {
        res.redirect('./scene/family');
    } else {
        res.redirect('./scene/out');
    }
}
exports.choice = (req, res) => {
    scene({ socket: req.socket }).catch(e => console.error(e));
    res.redirect('../');
    // res.redirect('../../');
}
exports.familyScene = (req, res) => {
    res.render('management/presentation/family_scene', { id: renderId });
}

exports.outScene = (req, res) => {
    res.render('management/presentation/out_scene');
}
exports.emotion = async (req, res) => {
    await beginAnimation.beginEmotion();
    const animation = new utilAnimation();
    animation.start({ socket: req.socket });
    const emotion = new Emotion(5, path.join(__dirname, '../../views/public/images/'));
    await emotion.start().catch(err => console.error(err));
    emotionSocket({ socket: req.socket });
    renderId = `emotion${req.param('id')}`;
    res.redirect(req.header('referer'));
}

exports.homeAnimation = async (req, res) => {
    const result = await homeAnimationChoice().catch(e => console.error(e));
    const animation = new utilAnimation();
    animation.start({ socket: req.socket });
    renderId = result;
    res.redirect(req.header('referer'));
}

exports.suggestionStart = async (req, res) => {
    await suggestionPermission(req.param('types')).catch(err => console.error(err));
    const suggestion = new Suggestion();
    suggestion.start({ socket: req.socket });
    res.redirect(req.header('referer'));
}
