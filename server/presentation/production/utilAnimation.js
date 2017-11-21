/**
 * アニメーションをシーンごとに選択する。
 * Created by I.Asakawa on 2017/11/21.
 */

import AnimationDao from '../models/animation';

export default class utilAnimation {

    constructor() {

        /** シーン定数 **/
         this.ANIMATION_RETURN_HOME = 1;
         this.ANIMATION_RETURN_HOME_JOY = 2;
         this.ANIMATION_RETURN_HOME_ANGRY = 3;
         this.ANIMATION_COMMONNESS = 4;
         this.ANIMATION_RONELY = 5;
         this.ANIMATION_TRIED = 6;
         this.ANIMATION_HAPPINESS = 7;
         this.ANIMATION_HEARTHSTONE = 8;
         this.ANIMATION_SILENCE = 9;

         /** アニメーション名テスト用 **/
         this.ANIMATION_RETURN_HOME_NAME = '帰宅中アニメーション';
         this.ANIMATION_RETURN_HOME_JOY_NAME = '帰宅中（母喜）アニメーション';
         this.ANIMATION_RETURN_HOME_ANGRY_NAME = '帰宅中（母怒）アニメーション';
         this.ANIMATION_COMMONNESS_NAME = '家に入る直前アニメーション';
         this.ANIMATION_RONELY_NAME = '寂しい状態アニメーション';
         this.ANIMATION_TRIED_NAME = '疲れ状態アニメーション';
         this.ANIMATION_HAPPINESS_NAME = '幸せ状態アニメ−ション';
         this.ANIMATION_HEARTHSTONE_NAME = '団欒状態アニメーション';
         this.ANIMATION_SILENCE_NAME = '無言状態アニメーション';

         /* サンプルアニメーションhtml */
         this.sample_animation_html = '../../animation/sample_animation/project.html';
    }

    /**
     * アニメーションをソケットで送信する
     * @param  {[type]} app
     * @param  {[type]} animation_html アニメーションのhtml
     * @return {[type]}
     */
    main_screen_animation(app, animation_html){
        app.socket.io.on('connection', function(socket) {
           app.socket.io.emit('url', animation_html);
        });
    }

    start(app){
        return new Promise(async (resolve, reject) => {

            const animationDao = new AnimationDao;
            /* シーンID取得 */
            const sceneId = await animationDao.getScene().catch(err => console.log(err));

            /* シーンごとにアニメーション割り振り */
            let management_id = 0;
            switch (sceneId[0]) {
                case this.ANIMATION_RETURN_HOME:
                    management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_RETURN_HOME_NAME).catch(err => console.log(err));
                    this.main_screen_animation(app, this.sample_animation_html);
                    break;

                case this.ANIMATION_RETURN_HOME_JOY:
                    management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_RETURN_HOME_JOY).catch(err => console.log(err));
                    break;

                case this.ANIMATION_RETURN_HOME_ANGRY:
                    management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_RETURN_HOME_ANGRY_NAME).catch(err => console.log(err));
                    break;

                case this.ANIMATION_COMMONNESS:
                    management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_COMMONNESS_NAME).catch(err => console.log(err));
                    break;

                case this.ANIMATION_RONELY:
                    management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_RONELY_NAME).catch(err => console.log(err));
                    break;

                case this.ANIMATION_TRIED:
                    management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_TRIED_NAME).catch(err => console.log(err));
                    break;

                case this.ANIMATION_HAPPINESS:
                    management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_HAPPINESS_NAME).catch(err => console.log(err));
                    break;

                case this.ANIMATION_HEARTHSTONE:
                    management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_HEARTHSTONE_NAME).catch(err => console.log(err));
                    break;

                case this.ANIMATION_SILENCE:
                    management_id = await animationDao.insertAnimationFirstData(this.ANIMATION_SILENCE_NAME).catch(err => console.log(err));
                    break;
            }

            /* アニメーション監視部分 */
            let type = '';
            let successFlg = false;
            let i = 0;

            var io = setInterval(async function() {

                //監視するアニメーションのタイプを取得
                type = await animationDao.selectMonitoringAnimetionType(management_id).catch(err => console.log(err));

                //アニメーションのタイプがendの場合監視を終了し処理を終了させる
                if(type[0] === 'end'){
                    successFlg = true;
                }

                if(successFlg === true){
                    clearInterval(io);
                    resolve('success');
                }

            }, 3000);//3秒loop
        });
    }
}
