/**
 * プレゼンの全体進行管理を行う
 * 各セクションをpromiseで実行。各セクションモデュールは必要モデュールの実行とロングポーリングでDBを監視をするタイプ・
 * メリット
 * 全体進行を管理しやすい。
 * デメリット
 * DBを監視しないといけない負荷がある。
 * Created by kokikono on 2017/11/07.
 */
import createFamilyPreparation from './mock/createFamilyPreparation';
import createFamily from './mock/createFamily';
import scene from './mock/scene';
import animation from './mock/utilAnimation';
import emotion from './mock/emotion';
import homeAnimationChoice from './mock/homeAnimationChoice';
import suggesion from './mock/suggestion';
import presentationBranch from './mock/presentationBranch';

const run = async (app) => {
    // console.log(app.socket.io);
    let result = null;
    console.log('present start');

    console.log('家族作成準備スタート')
    result = await createFamilyPreparation().catch((err) => { throw err; });
    console.log(`家族作成準備 ${result}`);

    console.log('家族作成スタート');
    result = await createFamily().catch((err) => { throw err; });
    console.log(`家族作成 ${result}`);

    console.log('シーン選択開始');
    result = await scene().catch((err) => { throw err; });
    console.log(`シーン選択終了 ${result}`);

    console.log('帰宅中アニメーショ開始');
    result = await animation().catch((err) => { throw err; });
    console.log(`帰宅中アニメーション終了 ${result} `);

    console.log('感情読み取り開始');
    result = await emotion().catch((err) => { throw err; });
    console.log(`感情読み取り終了 ${result}`);

    console.log('家内アニメーション選択処理開始');
    result = await homeAnimationChoice().catch((err) => { throw err; });
    console.log(`家内アニメーション選択処理終了 ${result}`);

    console.log('家内アニメーショ開始');
    result = await animation().catch((err) => { throw err; });
    console.log(`家内アニメーション終了 ${result} `);

    console.log('スマホ確認アニメーショ開始');
    result = await animation().catch((err) => { throw err; });
    console.log(`スマホ確認アニメーション終了 ${result} `);

    // ここがネック。どういう状態になったら終了にしていいかの判断が難しい。
    console.log('スマホ操作中アニメーショ開始');
    result = await animation().catch((err) => { throw err; });
    console.log(`スマホ操作中アニメーション終了 ${result} `);

    console.log('帰宅前アニメーション開始');
    result = await animation().catch((err) => { throw err; });
    console.log(`帰宅前アニメーション終了 ${result} `);

    console.log('感情読み取り開始');
    result = await emotion().catch((err) => { throw err; });
    console.log(`感情読み取り終了 ${result}`);

    console.log('ご飯アニメーション開始');
    result = await animation().catch((err) => { throw err; });
    console.log(`ご飯アニメーション終了 ${result} `);

    console.log('提案開始');
    result = await suggesion().catch((err) => { throw err; });
    console.log(`提案終了 ${result} `);

    console.log('感情読み取り開始');
    result = await emotion().catch((err) => { throw err; });
    console.log(`感情読み取り終了 ${result}`);

    console.log('提案結果アニメーション開始');
    result = await animation().catch((err) => { throw err; });
    console.log(`提案結果アニメーション終了 ${result} `);

    console.log('シーン再選択or終了選択開始');
    result = await presentationBranch().catch((err) => { throw err; });
    console.log(`シーン再選択or終了選択終了 ${result.msg} `);

    if (result.isEnd) {
        console.log('プレゼン終了アニメーション開始');
        result = await animation().catch((err) => { throw err; });
        console.log(`プレゼン終了アニメーション終了 ${result} `);
    } else {
        run();
    }
};

export default run;
