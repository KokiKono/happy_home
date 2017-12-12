/**
 * プレゼンの全体進行管理を行う
 * 各セクションをpromiseで実行。各セクションモデュールは必要モデュールの実行とロングポーリングでDBを監視をするタイプ・
 * メリット
 * 全体進行を管理しやすい。
 * デメリット
 * DBを監視しないといけない負荷がある。
 * Created by kokikono on 2017/11/07.
 */
import * as path from 'path';
import CreateFamilyPreparation from './production/createFamilyPreparation';
import createFamily from './production/createFamily';
import scene from './production/scene';
import utilAnimation from './production/utilAnimation';
import TmpFace from './models/tmpFace';
import Emotion from './production/emotion';
import homeAnimationChoice from './production/homeAnimationChoice';
import Suggestion from './production/suggestion';
import suggestionPermission from './production/suggestionPermistion';
import emotionSocket from './production/emotionSocket';
import * as beginAnimation from './production/beginAnimation';

const run = async (app) => {

    let result = null;
    console.log('ストーリーシステム開始');

    console.log('クリーン処理スタート');
    const tmpFace = new TmpFace();
    result = await tmpFace.deleteAll();
    console.log(`クリーン処理 ${result}`);

    console.log('家族作成準備スタート');
    const createFamilyPreparation = new CreateFamilyPreparation(10, path.join(__dirname, '../views/public/images/'));
    result = await createFamilyPreparation.start().catch(err => console.log(err));
    console.log(`家族作成準備 ${result}`);

    console.log('家族作成スタート');
    result = await createFamily(app).catch((err) => { throw err; });
    console.log(`家族作成 ${result}`);

    console.log('シーン選択開始');
    result = await scene(app).catch((err) => { throw err; });
    console.log(`シーン選択終了 ${result}`);

    // console.log('帰宅中アニメーショ開始');
    // result = await animation.start(app).catch((err) => { throw err; });
    // console.log(`帰宅中アニメーション終了 ${result} `);
    result = await beginAnimation.beginEmotion();
    console.log('感情読み取り開始');
    const emotion = new Emotion(10, path.join(__dirname, '../views/public/images/'))
    result = await emotion.start().catch((err) => {
        console.log('emotion err!!!!!!!1');
        console.log(err);
        throw err;
    });
    // return;
    emotionSocket(app);


    console.log(`感情読み取り終了 ${result}`);

    console.log('帰宅中アニメーション選択処理開始');
    result = await homeAnimationChoice().catch((err) => { throw err; });
    console.log(`帰宅中アニメーション選択処理終了 ${result}`);

    console.log('帰宅中アニメーショ開始');
    const animation = new utilAnimation();
    result = await animation.start(app).catch((err) => { throw err; });
    console.log(`帰宅中アニメーション終了 ${result} `);


    // console.log('スマホ確認アニメーショ開始');
    // result = await animation.start(app).catch((err) => { throw err; });
    // console.log(`スマホ確認アニメーション終了 ${result} `);

    // ここがネック。どういう状態になったら終了にしていいかの判断が難しい。
    result = await beginAnimation.beginConfirmSmtartFhone();
    console.log('スマホ操作中アニメーショ開始');
    result = await animation.start(app).catch((err) => { throw err; });
    console.log(`スマホ操作中アニメーション終了 ${result} `);

    result = await beginAnimation.beginComebackHome();
    console.log('帰宅前アニメーション開始');
    result = await animation.start(app).catch((err) => { throw err; });
    console.log(`帰宅前アニメーション終了 ${result} `);

    result = await beginAnimation.beginEmotion();
    console.log('感情読み取り開始');
    result = await emotion.start().catch((err) => { throw err; });
    emotionSocket(app);
    console.log(`感情読み取り終了 ${result}`);

    result = await beginAnimation.beginFamilyHeartstone();
    console.log('ご飯アニメーション開始');
    result = await animation.start(app).catch((err) => { throw err; });
    console.log(`ご飯アニメーション終了 ${result} `);

    result = await beginAnimation.beginSuggestion();
    console.log('提案許可処理開始');
    result = await suggestionPermission().catch((err) => { throw err; });
    console.log(`提案許可処理終了 ${result}`);

    console.log('提案開始');
    const suggestion = new Suggestion();
    result = await suggestion.start(app).catch((err) => { throw err; });
    console.log(`提案終了 ${result} `);

    result = await beginAnimation.beginEmotion();
    console.log('感情読み取り開始');
    result = await emotion.start().catch((err) => { throw err; });
    emotionSocket(app);
    console.log(`感情読み取り終了 ${result}`);

    // あとでちゃんとする。
    result = await beginAnimation.beginComebackHome();
    console.log('提案結果アニメーション開始');
    result = await animation.start(app).catch((err) => { throw err; });
    console.log(`提案結果アニメーション終了 ${result} `);

    console.log('ストーリーシステム終了');
};

function sleep(time) {
    const d1 = new Date();
    while (true) {
        const d2 = new Date();
        if (d2 - d1 > time) {
            return;
        }
    }
}

export default run;
