/**
 * Created by kokikono on 2017/12/15.
 */
import * as path from 'path';
import * as fs from 'fs';
import momentTimezone from 'moment-timezone';
import moment from 'moment';

import TmpFace from '../../presentation/models/tmpFace';
import createFamily from '../../presentation/production/createFamily';
import scene from '../../presentation/production/scene';
import emotionSocket from '../../presentation/production/emotionSocket';
import homeAnimationChoice from '../../presentation/production/homeAnimationChoice';
import utilAnimation from '../../presentation/production/utilAnimation';
import * as beginAnimation from '../../presentation/production/beginAnimation';
import suggestionPermission from '../../presentation/production/suggestionPermistion';
import Suggestion from '../../presentation/production/suggestion';
import homeDinnerAnimation from '../../presentation/production/homeDinnerAnimationChoice';
import FamilyModel from '../../presentation/models/family';
import Presentation from '../../presentation/models/presentation';
import BrawserCamera from '../../presentation/production/brawserCamera';
import EmotionCamera from '../../presentation/production/emotionCamera';
import FamilyListModel from '../../models/family_list';
import configFile from '../../../config.json';
import FamilyDao from '../../models/family';
import SceneModel from '../../models/scene';
import Emotion from '../../presentation/production/emotion';
import CreateFamilyPresentation from '../../presentation/production/createFamilyPreparation';

const config = configFile[process.env.NODE_ENV];

const renderParam = {
    id: '',
    sentence_title: '',
    sentence: '',
    next_btn: '',
    next_btn_href: '',
    emotion_id: 0,
    is_family_scene: false,
    image: undefined,
    beginTime: moment(),
};
exports.indexParam = async (req, res, next) => {
    renderParam.family_list = undefined;
    renderParam.image = undefined;
    if (!req.param('id')) return next();
    const id = req.param('id');
    console.log(`id=${id}`);
    const animation = new utilAnimation();
    if (id === '0') {
        {
            console.log('クリーン処理');
            // await beginAnimation.beginClean();
            // animation.start({socket: req.socket});
            req.socket.io.emit('url', '../../animation/clean/index.html');
            const tmpFace = new TmpFace();
            await tmpFace.deleteAll().catch(e => console.error(e));
            renderParam.id = 'clean';
            console.info('cleaned')
            return next();
        }
    } else if (id === '1') {
        {
            console.log('家族作成前準備');
            renderParam.id = 'create_family_preparation';
            return next();
        }
    } else if (id === '2') {
        {
            console.log('家族作成');
            // createFamily({socket: req.socket}).then(s => console.log(s))
            //     .catch(e => console.error(e));
            // 素材取得
            const familyListModel = new FamilyListModel();
            familyListModel.select()
                .then((result) => {
                console.warn('顔認証できた顔情報');
                    console.log(result.results);
                    const main = result.results.filter((element) => {
                        try {
                            fs.statSync(path.join(__dirname, `../../views/public/images/${element.face_id}.jpg`));
                            return element;
                        } catch (er) {
                            console.error(er)
                            return false;
                        }
                    });
                    renderParam.id = 'create_family';
                    renderParam.family_list = main;
                    renderParam.api_url = `http://${config.server.url}:${config.server.port}/api/family_list`;
                   return next();
                })
                .catch((err) => {
                    next(err);
                });
            // renderParam.id = 'create_family';
            // return next();
        }
    } else if (id === '3') {
        renderParam.main = null;
        renderParam.id = 'create_family';
        return next();
    } else {
        return next();
    }
}
exports.postCreateFamily = async (req, res) => {
    console.warn(req.body);
    // request body の作成
    const body = [];
    req.body.face_id.forEach((element, index) => {
        const bodyItem = {};
        bodyItem.face_id = element;
        bodyItem.type = req.body.type[index];
        bodyItem.name = req.body.name[index];
        body.push(bodyItem);
    });
    console.warn(body);
    const familyModel = new FamilyDao();
    await familyModel.postFamily(body)
        .catch(err => console.error(err));
    res.redirect('./?id=3');
}
exports.root = (req, res) => {
    renderParam.id = 'root';
    res.redirect('../portal/');
}
exports.index = (req, res) => {
    switch (renderParam.id) {
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
            renderParam.image = `http://${config.server.url}:8080/public/portal_images/create_family.png`;
            return res.render('management/portal/index', renderParam);
        }
        case 'create_family': {
            renderParam.sentence_title = '家族情報が正常に登録されました。';
            renderParam.sentence = '家族情報の登録が終わったあとは、家族のシーンを選択します。';
            renderParam.next_btn = 'シーン選択へ';
            renderParam.next_btn_href = './scene/choice';
            renderParam.image = `http://${config.server.url}:8080/public/portal_images/created_family.png`;
            return res.render('management/portal/index', renderParam);
        }
        case 'scene_choice': {
            renderParam.sentence_title = 'シーン選択が正常に登録されました。';
            renderParam.sentence = 'では、選択したシーンを体験してみましょう。';
            renderParam.next_btn = '選択シーンへ';
            renderParam.next_btn_href = './scene';
            renderParam.image = `http://${config.server.url}:8080/public/portal_images/happy_home.png`;
            return res.render('management/portal/index', renderParam);
        }
        case 'root': {
            renderParam.sentence_title = '家族を作成し直す場合はボタンを押してください。';
            renderParam.sentence = 'シーンを再選択したい場合は、右のフローチャートの<br>' +
                '「シーン選択」を直接押してください。';
            renderParam.next_btn = '家族の再作成へ';
            renderParam.next_btn_href = './';
            renderParam.image = `http://${config.server.url}:8080/public/portal_images/happy_home.png`;
            return res.render('management/portal/index', renderParam);
        }
        default: {
            renderParam.sentence_title = 'はじめは、家族情報の作成を行います。';
            renderParam.sentence = '家族情報で重要な顔情報を撮影します。';
            renderParam.next_btn = '写真撮影に進む。';
            renderParam.next_btn_href = './create_family_presentation';
            renderParam.image = `http://${config.server.url}:8080/public/portal_images/create_family_presentation.png`;
            return res.render('management/portal/index', renderParam); // eslint-disable-line
        }
    }
}

exports.scene = async (req, res, next) => {
    renderParam.image = undefined;
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
        renderParam.image = `http://${config.server.url}:8080/public/portal_images/emotion_scanning.png`;
        res.redirect('./scene/family');
    } else {
        renderParam.id = 'first';
        renderParam.sentence_title = '留守シーンでHappy Homeを体験していきます。';
        renderParam.sentence = '今、奥さんは子供たちと年末年始のため実家に帰郷しています。' +
            '<br>仕事熱心なお父さんは仕事追われているため、一人でお留守番をしています。' +
            '<br>Happy Homeは家族のために仕事を頑張っているために旦那さんを幸せにしようと考えました。' +
            '<br>まずは、帰宅しましょう。';
        renderParam.next_btn = '家にかえる。';
        renderParam.next_btn_href = '../animation/out/comeback';
        renderParam.image = `http://${config.server.url}:8080/public/portal_images/happy_home.png`;
        res.redirect('./scene/out');
    }
}
exports.choice = (req, res) => {
    // scene({ socket: req.socket }).catch(e => console.error(e));
    renderParam.scene_select = true;
    renderParam.image = `http://${config.server.url}:8080/public/portal_images/scene.png`;
    res.redirect('../');
    // res.redirect('../../');
}

exports.postChoice = async (req, res) => {
    const familyModel = new FamilyDao();
    const latestFamily = await familyModel.latestFamily();
    const sceneModel = new SceneModel();
    await sceneModel.insertScene(latestFamily[0].id, req.body.type)
        .catch(err => console.error(err));
    renderParam.id = 'scene_choice';
    renderParam.scene_select = undefined;
    renderParam.image = undefined;
    res.redirect('../');
}
exports.familyScene = (req, res) => {
    renderParam.is_family_scene = true;
    res.render('management/portal/family_scene', renderParam);
}

exports.outScene = (req, res) => {
    renderParam.is_family_scene = false;
    res.render('management/portal/out_scene', renderParam);
}
exports.emotion = async (req, res) => {
    // const emotionCamera = new EmotionCamera();
    // await emotionCamera.start({ socket: req.socket });
    // emotionSocket({ socket: req.socket });
    renderParam.image = `http://${config.server.url}:8080/public/portal_images/emotion_scanning.png`;

    renderParam.sentence_title = '感情読み取りが完了しました。';
    renderParam.sentence = 'Happy Home動作確認画面をご覧ください。<br>' +
        '先程、測定した感情データがグラフとして表示されています。<br>';
    if (req.param('id').indexOf('end') >= 0) {
        renderParam.id += '-end-emotion';
        renderParam.sentence = '最後の提案をみなさんを幸せにできましたか？<br>' +
            '実際は、Happy Homeは常に家族の感情を見守りながら、より家族を幸せに夫婦をラブラブにするように、<br>' +
            '学習し提案制度を上げたり個人特有の提案をするように成長していきます。<br>';
        renderParam.next_btn = 'トップに戻る';
        renderParam.next_btn_href = '../root';
    } else {
        renderParam.id = `emotion${req.param('id')}`;
        switch (req.param('id')) {
            case '1': {
                renderParam.sentence += '次は、測定した感情を元に家族の様子を見てみましょう';
                renderParam.next_btn = '家族の様子を見る。';
                renderParam.next_btn_href = '../animation/start';
                if (renderParam.is_family_scene === false) {
                    // 留守シーン用
                    renderParam.sentence += 'お父さんは今から、晩御飯を食べるようです。<br>' +
                        'その様子を見てみましょう';
                    renderParam.next_btn = '晩御飯の様子を見る。';
                    renderParam.next_btn_href = '../animation/out/dinner';
                    renderParam.image = `http://${config.server.url}:8080/public/portal_images/happy_home.png`;
                }
                break;
            }
            case '2': {
                renderParam.sentence += '旦那さんの帰りを待っている家族の元に帰りましょう。'
                renderParam.next_btn = '家にかえる。';
                renderParam.image = `http://${config.server.url}:8080/public/portal_images/happy_home.png`;
                renderParam.next_btn_href = '../animation/home_comeback?types[]=light';
                break;
            }
            default: break;
        }
    }
    res.redirect(req.header('referer'));
}

exports.homeAnimation = async (req, res) => {
    renderParam.image = undefined;
    const result = await homeAnimationChoice().catch(e => console.error(e));
    const animation = new utilAnimation();
    animation.start({ socket: req.socket });
    renderParam.id = result;
    renderParam.sentence_title = '家族の様子は確認できましたか？';
    renderParam.sentence = 'ここでは、お母さんの表情で喜んでいるか、怒っているかで分岐します。<br>' +
        '（怒っている判定は、無表情、軽蔑、怒り）' +
        '（喜び判定は幸せ値）<br>' +
        '左のフロー図に、分岐結果がピンク色でマークされています。<br>' +
        'Happy Homeは家族の愛を深めるには、お母さんが重要な役割を担っていると考えています。<br>' +
        'その為、怒っている場合は機嫌が直る提案を考え、喜びの場合はさらに幸せになるように提案します。';
    renderParam.image = `http://${config.server.url}:8080/public/portal_images/suggestion.png`;
    renderParam.next_btn = '提案を開始する。';
    renderParam.next_btn_href = '../suggestion?types[]=mobile';
    console.info(renderParam)
    res.redirect(req.header('referer'));
}

exports.suggestionStart = async (req, res) => {
    renderParam.image = undefined;
    await beginAnimation.beginSuggestion();
    const animation = new utilAnimation();
    animation.start({ socket: req.socket });
    await suggestionPermission(req.param('types')).catch(err => console.error(err));
    const suggestion = new Suggestion();
    await suggestion.start({ socket: req.socket });
    renderParam.id += '-suggestion';
    if (renderParam.id.indexOf('mom') >= 0) {
        renderParam.sentence_title = '提案処理が完了しました。';
        renderParam.sentence = 'モバイルアプリに最適な通知がされています。<br>' +
            'Happy Homeが提案した内容を確認してみましょう。<br>';
        renderParam.next_btn = '提案内容を確認する。';
        renderParam.next_btn_href = '../animation/mobile';
        renderParam.image = `http://${config.server.url}:8080/public/portal_images/suggestion.png`;
    } else {
        renderParam.sentence_title = '提案処理が完了しました。';
        renderParam.sentence = '今回の提案は家族が家の中にいるということで、<br>' +
            '家の中からできる提案のみに絞っています。<br>' +
            'Happy Homeが提案した結果の感情読み取りを開始する。';
        renderParam.next_btn = '感情読み取りを開始する。';
        renderParam.image = `http://${config.server.url}:8080/public/portal_images/suggestion.png`;
        renderParam.next_btn_href = '../emotion';
    }
    if (renderParam.id.indexOf('comeback_animation') >= 0) {
        renderParam.sentence = '今回の提案は家族が家の中にいるということで、<br>' +
            '家の中からできる提案のみに絞っています。<br>' +
            'Happy Homeが提案した結果の感情読み取りを開始する。';
        renderParam.next_btn = '感情読み取りを開始する。';
        renderParam.image = `http://${config.server.url}:8080/public/portal_images/suggestion.png`;
        renderParam.next_btn_href = `../emotion?id=${renderParam.id}-end`;
    }
    if (renderParam.is_family_scene === false) {
        // 留守シーん用の提案
        renderParam.sentence = '今回の提案は、帰郷している家族に対しての通知提案と<br>' +
            '家に一人でいるお父さんに対してできる提案に絞っています。' +
            'Happy Homeが提案した結果を確認したあとは、お父さんの感情を読み取ってみましょう。';
        renderParam.next_btn = '感情読み取りを開始する。';
        renderParam.image = `http://${config.server.url}:8080/public/portal_images/suggestion.png`;
        renderParam.next_btn_href = `../emotion?id=${renderParam.id}-end`;
    }
    res.redirect(req.header('referer'));
}

exports.suggestionHome = async (req, res) => {
    await beginAnimation.beginSuggestion();
    const animation = new utilAnimation();
    animation.start({ socket: req.socket });
    await suggestionPermission(req.param('types')).catch(err => console.error(err));
    const suggestion = new Suggestion();
    await suggestion.start({ socket: req.socket });
    renderParam.id += '-suggestion';
    renderParam.sentence_title = '提案処理が完了しました。';
    renderParam.sentence = '今回の提案は家族が家の中にいるということで、<br>' +
        '家の中からできる提案のみに絞っています。<br>' +
        'Happy Homeが提案した結果の感情読み取りを開始する。';
    renderParam.next_btn = '感情読み取りを開始する。';
    renderParam.image = `http://${config.server.url}:8080/public/portal_images/suggestion.png`;
    renderParam.next_btn_href = `../emotion?id=${renderParam.emotion_id}`
    res.redirect(req.header('referer'));
}

exports.mobileAnimation = async (req, res) => {
    await beginAnimation.beginConfirmSmtartFhone();
    const animation = new utilAnimation();
    animation.start({ socket: req.socket });

    renderParam.id = renderParam.id.replace('suggestion', 'mobile_animation');
    if (req.param('status')) {
        renderParam.id = req.param('status') + '-mobile_animation';
    }
    renderParam.sentence_title = 'スマホを確認しましょう。';
    renderParam.sentence = 'スマホアプリに提案の通知を行いました。<br>' +
        'ここでは、旦那さんが帰る前に家族を幸せになる提案を通知しました。<br>' +
        '旦那さんは通知内容を確認し、家族が幸せになるように頑張って行動してみましょう。<br>' +
        '提案内容を実行したあとは、家族の感情をもう一度測定し、旦那さんの頑張りが家族に反映されたかを感情測定してみましょう。';
    renderParam.next_btn = '感情測定を行う。';
    renderParam.image = `http://${config.server.url}:8080/public/portal_images/mobile.png`;
    renderParam.next_btn_href = '../emotion?id=2';
    res.redirect(req.header('referer'));
}

exports.homeComebackAnimation = async (req, res) => {
    await beginAnimation.beginComebackHome();
    const animation = new utilAnimation();
    animation.start({ socket: req.socket });
    // 屋根光らせる
    await suggestionPermission(req.param('types')).catch(err => console.error(err));
    const suggestion = new Suggestion();
    await suggestion.start({ socket: req.socket });
    switch (renderParam.id) {
        case 'emotion2': {
            renderParam.id = 'comeback_animation2';
            break;
        }
        case 'emotion3': {
            renderParam.id = 'comeback_animation3';
            break;
        }
    }
    renderParam.id = renderParam.id.replace('mobile_animation', 'home_comeback_animation');
    renderParam.image = `http://${config.server.url}:8080/public/portal_images/happy_home.png`;
    renderParam.sentence_title = '家族の様子は屋根ライトで確認できましたか？';
    renderParam.sentence = 'ピンク色なら家族が幸せな雰囲気だということです。<br>' +
        'Happy Homeは家にいる家族の様子を観察し、何か提案がある場合は<br>' +
        '対象人物に提案をアプリで通知します。<br>' +
        '通知を受けた人は家族のために提案を選択、実行し家族がいつも幸せにいるようにサポートします。<br>';
    renderParam.next_btn = '最後に家族みんなで晩御飯を食べるシーンを体験しましょう。';
    renderParam.next_btn_href = '../animation/dinner';
    res.redirect(req.header('referer'));
}

exports.dinner = async (req, res) => {
    const result = await homeDinnerAnimation().catch(err => console.error(err));
    const animation = new utilAnimation();
    animation.start({ socket: req.socket });
    renderParam.id += `-${result}`;
    renderParam.sentence_title = '帰宅後の家の中は確認できましたか？';
    renderParam.sentence = '今は家族でご飯を食べています。<br>' +
        'プレゼンの最後は、家族全員が家にいる場合の提案を体験してもらおうと思います。<br>' +
        '家族が全員、家にいる場合は、家の中でできる提案のみを行います。'
    renderParam.next_btn = '提案を開始する。';
    renderParam.next_btn_href = '../suggestion?types[]=reform&types[]=talk';
    console.info(renderParam)
    res.redirect(req.header('referer'));
}

exports.outHomeComeback = async (req, res) => {
    // TODO 留守シーン用の帰宅アニメーションに帰る。
    await beginAnimation.beginComebackHome();
    const animation = new utilAnimation();
    animation.start({ socket: req.socket });
    renderParam.id = 'home_comeback';
    renderParam.sentence_title = 'おかえりなさい！';
    renderParam.sentence = '仕事に追われたお父さんはようやく、家にかえることができました。' +
        'Happy Homeは帰宅時に、家族の感情を読み取り、最適な提案を行います。<br>' +
        '早速、感情読み取りを開始しましょう。';
    renderParam.next_btn = '感情読み取りを開始する。';
    renderParam.next_btn_href = '../emotion?id=1';
    res.redirect(req.header('referer'));
}

exports.outDinner = async (req, res) => {
    const result = await homeDinnerAnimation().catch(err => console.error(err));
    const animation = new utilAnimation();
    animation.start({ socket: req.socket });
    renderParam.id = `${result}`;
    renderParam.sentence_title = '帰宅後のお父さんの晩御飯の様子は確認できました';
    renderParam.sentence = '今はお父さん一人でご飯を食べています。<br>' +
        '留守シーンでは、離れている家族にも、モバイルアプリを通じて、提案できるところが特徴的です。<br>' +
        'また、感情によっては、おしゃべりくんやリフォームくんが家にいるお父さんにも直接される場合もあります。'
    renderParam.next_btn = '提案を開始する。';
    renderParam.next_btn_href = '../suggestion';
    console.info(renderParam)
    res.redirect(req.header('referer'));
}

exports.emotionStart = (req, res) => {
    // 写真撮影の画面にレンダリング
    // idをレンダリング
}

exports.postUpload = (req, res, next) => {
    if (!req.files) {
        const err = new Error('files not found');
        next(err);
    }
    for (let count = 0; count < 10; count += 1) {
        const timestamp = moment(momentTimezone().tz('Asia/Tokyo').format()).format('Y-M-d-HH-M-ss-sss');
        req.files[`images${count}`].mv(`${path.join(__dirname, '../../views/public/images/')}${timestamp}-${count}.jpg`);
    }
    res.sendStatus(200);
}

exports.updateBeginTime = () => {
    const nowTime = momentTimezone().tz('Asia/Tokyo').format();
    renderParam.beginTime = moment(nowTime);
}

exports.postEmotion = async (req, res) => {
    const emotion = new Emotion(10, path.join(__dirname, '../../views/public/images/'));
    await emotion.start(renderParam.beginTime);
    req.socket.io.emit('url', 'http://' + config.server.url + ':8080/animation/emotion_scaning_finish/index.html');
    emotionSocket({ socket: req.socket });
    res.redirect(`../emotion?id=${req.param.id}`);
}

exports.createFamilyPresentation = (req, res) => {
    // 写真撮影の画面にレンダリング
    // idをレンダリング
    res.render(
        'brawser_camera/create_family_camera2',
        {
            action: './post_create_family?id=1',
            url: `https://${config.server.url}:5000/management/portal/post_create_family_presentation?id=1`,
        },
    );
}
exports.postCreateFamilyPresentation = async (req, res) => {
    const createFamilyPreparation = new CreateFamilyPresentation(10, path.join(__dirname, '../../views/public/images/'));
    await createFamilyPreparation.start(renderParam.beginTime).catch(err => console.log(err));
    req.socket.io.emit('url', 'http://' + config.server.url + ':8080/animation/create_family_finish/index.html');
    res.redirect(`./?id=${req.param('id')}`);
}