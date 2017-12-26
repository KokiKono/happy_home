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
const renderParam = {
    id: renderId,
    sentence_title: '',
    sentence: '',
    next_btn: '',
    next_btn_href: '',
};
exports.indexParam = async (req, res, next) => {
    if (!req.param('id')) return next();
    const id = req.param('id');
    console.log(`id=${id}`);
    const animation = new utilAnimation();
    switch (id) {
        case '0': {
            console.log('クリーン処理');
            await beginAnimation.beginClean();
            animation.start({ socket: req.socket });
            const tmpFace = new TmpFace();
            await tmpFace.deleteAll().catch(e => console.error(e));
            renderId = 'clean';
            return next();
        }
        case '1': {
            console.log('家族作成前準備');
            await beginAnimation.beginCreateFamily();
            animation.start({ socket: req.socket });
            const createFamilyPreparation = new CreateFamilyPreparation(10, path.join(__dirname, '../../views/public/images/'));
            await createFamilyPreparation.start()
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
    switch (renderId) {
        case 'clean': {
            renderParam.sentence_title = 'クリーン処理が終わりました。';
            renderParam.sentence = '次は家族情報の登録のために写真を撮ります。';
            renderParam.next_btn = '写真撮影に進む。';
            renderParam.next_btn_href = './?id=1';
            return res.render('management/portal/index', renderParam);
        }
        case 'create_family_preparation': {
            renderParam.sentence_title = '家族写真のご協力ありがとうございます。';
            renderParam.sentence = '先程撮った写真から顔写真を自動作成し顔写真に名前をつけましょう。';
            renderParam.next_btn = '撮った写真に名前をつける。';
            renderParam.next_btn_href = './?id=2';
            return res.render('management/portal/index', renderParam);
        }
        case 'create_family': {
            renderParam.sentence_title = '家族情報が正常に登録されました。';
            renderParam.sentence = '家族情報の登録が終わったあとは、家族のシーンを選択します。';
            renderParam.next_btn = 'シーン選択へ';
            renderParam.next_btn_href = './scene/choice';
            return res.render('management/portal/index', renderParam);
        }
        case 'scene_choice': {
            renderParam.sentence_title = 'シーン選択が正常に登録されました。';
            renderParam.sentence = 'では、選択したシーンを体験してみましょう。';
            renderParam.next_btn = '選択シーンへ';
            renderParam.next_btn_href = './scene';
            return res.render('management/portal/index', renderParam);
        }
        default: {
            renderParam.sentence_title = 'システムエラー';
            renderParam.sentence = '異常終了しました。<br>お手数ですが、前回のステージからやり直してください。';
            renderParam.next_btn = '前回のステージへ';
            renderParam.next_btn_href = './';
            return res.render('management/portal/index', renderParam); // eslint-disable-line
        }
    }
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
        renderParam.sentence_title = '家族シーンでHappy Homeを体験していきます。';
        renderParam.sentence = '今、家では旦那さんの帰りを待ちながら奥さんが家事を行っています。<br>' +
            'ここで、奥さんの今の感情を測定してみましょう。';
        renderParam.next_btn = '感情測定を開始する。';
        renderParam.next_btn_href = '../emotion?id=1';
        res.redirect('./scene/family');
    } else {
        renderParam.sentence_title = '留守シーンでHappy Homeを体験していきます。';
        renderParam.sentence = '今、奥さんは子供たちと年末年始のため実家に帰郷しています。' +
            '<br>仕事熱心なお父さんは仕事追われているため、一人でお留守番をしています。' +
            '<br>Happy Homeは家族のために仕事を頑張っているために旦那さんを幸せにしようと考えました。' +
            '<br>ここで、帰宅直前のお父さんの感情を測定してみましょう。';
        renderParam.next_btn = '感情測定を開始する。';
        renderParam.next_btn_href = '../emotion?id=1';
        res.redirect('./scene/out');
    }
}
exports.choice = (req, res) => {
    scene({ socket: req.socket }).catch(e => console.error(e));
    renderId = 'scene_choice';
    res.redirect('../');
    // res.redirect('../../');
}
exports.familyScene = (req, res) => {
    res.render('management/portal/family_scene', renderParam);
}

exports.outScene = (req, res) => {
    res.render('management/portal/out_scene', renderParam);
}
exports.emotion = async (req, res) => {
    await beginAnimation.beginEmotion();
    const animation = new utilAnimation();
    animation.start({ socket: req.socket });
    const emotion = new Emotion(5, path.join(__dirname, '../../views/public/images/'));
    await emotion.start().catch(err => console.error(err));
    emotionSocket({ socket: req.socket });
    renderId = `emotion${req.param('id')}`;
    renderParam.sentence_title = '感情読み取りが完了しました。';
    renderParam.sentence = 'Happy Home動作確認画面をご覧ください。<br>' +
        '先程、測定した感情データがグラフとして表示されています。';
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
    await beginAnimation.beginSuggestion();
    const animation = new utilAnimation();
    animation.start({ socket: req.socket });
    await suggestionPermission(req.param('types')).catch(err => console.error(err));
    const suggestion = new Suggestion();
    suggestion.start({ socket: req.socket });
    res.redirect(req.header('referer'));
}
