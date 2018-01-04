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
import homeDinnerAnimation from '../../presentation/production/homeDinnerAnimationChoice';
import FamilyModel from '../../presentation/models/family';
import Presentation from '../../presentation/models/presentation';
import BrawserCamera from '../../presentation/production/brawserCamera';
let renderId = '';
const renderParam = {
    id: renderId,
    sentence_title: '',
    sentence: '',
    next_btn: '',
    next_btn_href: '',
    emotion_id: 0,
};
exports.indexParam = async (req, res, next) => {
    if (!req.param('id')) return next();
    const id = req.param('id');
    console.log(`id=${id}`);
    const animation = new utilAnimation();
    if (id === '0') {
        {
            console.log('クリーン処理');
            await beginAnimation.beginClean();
            animation.start({socket: req.socket});
            const tmpFace = new TmpFace();
            await tmpFace.deleteAll().catch(e => console.error(e));
            renderId = 'clean';
            return next();
        }
    } else if (id === '1') {
        {
            console.log('家族作成前準備');
            // await beginAnimation.beginCreateFamily();
            // animation.start({socket: req.socket});
            // const createFamilyPreparation = new CreateFamilyPreparation(10, path.join(__dirname, '../../views/public/images/'));
            // await createFamilyPreparation.start()
            //     .catch(e => console.error(e));
            const brawserCamera = new BrawserCamera();
            await brawserCamera.start({socket: req.socket});
            renderId = 'create_family_preparation';
            return next();
        }
    } else if (id === '2') {
        {
            console.log('家族作成');
            createFamily({socket: req.socket}).then(s => console.log(s))
                .catch(e => console.error(e));
            renderId = 'create_family';
            return next();
        }
    } else {
        return next();
    }
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
        case 'root': {
            renderParam.sentence_title = '家族を作成し直す場合はボタンを押してください。';
            renderParam.sentence = 'シーンを再選択したい場合は、右のフローチャートの<br>' +
                '「シーン選択」を直接押してください。';
            renderParam.next_btn = '家族の再作成へ';
            renderParam.next_btn_href = './id=0';
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
                break;
            }
            case '2': {
                renderParam.sentence += '旦那さんの帰りを待っている家族の元に帰りましょう。'
                renderParam.next_btn = '家にかえる。';
                renderParam.next_btn_href = '../animation/home_comeback?types[]=light';
                break;
            }
            default: break;
        }
    }
    res.redirect(req.header('referer'));
}

exports.homeAnimation = async (req, res) => {
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
    renderParam.next_btn = '提案を開始する。';
    renderParam.next_btn_href = '../suggestion?types[]=mobile';
    console.info(renderParam)
    res.redirect(req.header('referer'));
}

exports.suggestionStart = async (req, res) => {
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
    } else {
        renderParam.sentence_title = '提案処理が完了しました。';
        renderParam.sentence = '今回の提案は家族が家の中にいるということで、<br>' +
            '家の中からできる提案のみに絞っています。<br>' +
            'Happy Homeが提案した結果の感情読み取りを開始する。';
        renderParam.next_btn = '感情読み取りを開始する。';
        renderParam.next_btn_href = '../emotion';
    }
    if (renderParam.id.indexOf('comeback_animation') >= 0) {
        renderParam.sentence = '今回の提案は家族が家の中にいるということで、<br>' +
            '家の中からできる提案のみに絞っています。<br>' +
            'Happy Homeが提案した結果の感情読み取りを開始する。';
        renderParam.next_btn = '感情読み取りを開始する。';
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

