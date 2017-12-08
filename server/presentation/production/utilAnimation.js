/**
 * アニメーションをシーンごとに選択する。
 * Created by I.Asakawa on 2017/11/21.
 */

import AnimationDao from '../models/animation';

export default class utilAnimation {

    constructor() {

        /* シーン定数 */
        this.SCENE_FAMILY = 0;
        this.SCENE_ABSENCE = 1;

        /* シーン定数 */
        //家族
        this.SCENE_FAMILY_RETURN_HOME_JOY = 1;
        this.SCENE_FAMILY_RETURN_HOME_ANGRY = 2;
        this.SCENE_FAMILY_HEARTHSTONE = 3;
        this.SCENE_FAMILY_SILENCE = 4;
        //留守
        this.SCENE_ABSENCE_RETURN_HOME = 1;
        this.SCENE_ABSENCE_RONELY = 2;
        this.SCENE_ABSENCE_TRIED = 3;
        this.SCENE_ABSENCE_HAPPINESS = 4;
        //単体
        this.ANIMATION_COMMON = 99;
        this.PHOTO_EMOTION_READING = 111;
        this.PHOTO_TEIAN_KUN = 222;

        /* アニメーション名テスト用 */
        this.ANIMATION_RETURN_HOME_NAME = '帰宅中アニメーション';
        this.ANIMATION_RETURN_HOME_JOY_NAME = '帰宅中（母喜）アニメーション';
        this.ANIMATION_RETURN_HOME_ANGRY_NAME = '帰宅中（母怒）アニメーション';
        this.ANIMATION_COMMONNESS_NAME = '家に入る直前アニメーション';
        this.ANIMATION_RONELY_NAME = '寂しい状態アニメーション';
        this.ANIMATION_TRIED_NAME = '疲れ状態アニメーション';
        this.ANIMATION_HAPPINESS_NAME = '幸せ状態アニメ−ション';
        this.ANIMATION_HEARTHSTONE_NAME = '団欒状態アニメーション';
        this.ANIMATION_SILENCE_NAME = '無言状態アニメーション';
        /* 画像用 */
        this.PHOTO_EMOTION_READING_NAME = '感情読み取り中画像';
        this.PHOTO_TEIAN_KUN_NAME = '提案くん画像';

        /* サンプルアニメーションhtml */
        this.sample_animation_html = '../../animation/sample_animation/project.html';
    }

    start(app){
        return new Promise(async (resolve, reject) => {

            // process.on('unhandledRejection', console.dir);

            const animationDao = new AnimationDao;
            /* シーンID取得 */
            const scene_pattern_list = await animationDao.getScenePattern().catch((err) => { reject(err); });

            let management_id = 0;

            /* シーン・パターンごとにアニメーション割り振り */
            if(String(scene_pattern_list[0]['pattern']).length > 1){

                //パターンIDが二桁以上の処理
                switch (scene_pattern_list[0]['pattern']) {
                    case this.ANIMATION_COMMON:
                        management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_COMMONNESS_NAME).catch((err) => { reject(err); });
                        break;

                    case this.PHOTO_EMOTION_READING:
                        //感情読み取り画像
                        break;

                    case this.PHOTO_TEIAN_KUN:
                        //提案君画像
                        break;
                }

            } else {

                //パターンIDが1桁（シーンIDがある）の処理
                switch (scene_pattern_list[0]['scene']) {

                    case this.SCENE_FAMILY://家族

                        switch (scene_pattern_list[0]['pattern']) {
                            case this.SCENE_FAMILY_RETURN_HOME_JOY://帰宅喜
                                management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_RETURN_HOME_JOY_NAME).catch((err) => { reject(err); });
                                app.socket.io.emit('url', this.sample_animation_html);
                                break;
                            case this.SCENE_FAMILY_RETURN_HOME_ANGRY://帰宅怒
                                management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_RETURN_HOME_ANGRY_NAME).catch((err) => { reject(err); });
                                app.socket.io.emit('url', this.sample_animation_html);
                                break;
                            case this.SCENE_FAMILY_HEARTHSTONE://団欒
                                management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_HEARTHSTONE_NAME).catch((err) => { reject(err); });
                                app.socket.io.emit('url', this.sample_animation_html);
                                break;
                            case this.SCENE_FAMILY_SILENCE://無言
                                management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_SILENCE_NAME).catch((err) => { reject(err); });
                                app.socket.io.emit('url', this.sample_animation_html);
                                break;
                        }

                        break;

                    case this.SCENE_ABSENCE://留守

                        switch (scene_pattern_list[0]['pattern']) {
                            case this.SCENE_ABSENCE_RETURN_HOME://帰宅
                                management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_RETURN_HOME_NAME).catch((err) => { reject(err); });
                                app.socket.io.emit('url', this.sample_animation_html);
                                break;
                            case this.SCENE_ABSENCE_RONELY://寂しい
                                management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_RONELY_NAME).catch((err) => { reject(err); });
                                app.socket.io.emit('url', this.sample_animation_html);
                                break;
                            case this.SCENE_ABSENCE_TRIED://疲れ
                                management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_TRIED_NAME).catch((err) => { reject(err); });
                                app.socket.io.emit('url', this.sample_animation_html);
                                break;
                            case this.SCENE_ABSENCE_HAPPINESS://幸せ
                                management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_HAPPINESS_NAME).catch((err) => { reject(err); });
                                app.socket.io.emit('url', this.sample_animation_html);
                                break;
                        }

                        break;
                }
            }

            if(String(scene_pattern_list[0]['pattern']).length < 3) {

                /* アニメーション監視部分 */
                let type = '';
                let successFlg = false;
                let i = 0;

                var io = setInterval(async function() {

                    //監視するアニメーションのタイプを取得
                    type = await animationDao.selectMonitoringAnimetionType(management_id).catch((err) => { reject(err); });

                    //アニメーションのタイプがendの場合監視を終了し処理を終了させる
                    if(type[0] === 'end'){
                        successFlg = true;
                    }

                    if(successFlg === true){
                        clearInterval(io);
                        resolve('success');
                    }

                }, 5000);//5秒loop
            }
        });
    }
}
