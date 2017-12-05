/**
 * 提案ロジック部分
 * Created by I.Asakawa on 2017/11/22.
 */

import SuggestionDao from '../models/suggestion';
import Led from '../../models/led';

export default class suggestion {

    constructor(){
        this.TYPE_MOBILE = 'mobile';
        this.TYPE_TALK = 'talk';
        this.TYPE_REFORM = 'reform';
        this.TYPE_RIGHT = 'right';

        this.TO_TYPE_MOTHER = '母';
        this.TO_TYPE_FATHER = '父';
        this.TO_TYPE_DAUGHTER = '娘';
        this.TO_TYPE_SON = '息子';

        this.SAMPLE_NOTICE_CONTENTS = '家族円満に協力してください。';
    }

    start(app){
        return new Promise(async (resolve, reject) => {

            const suggestionDao = new SuggestionDao;
            /* 提案許可されている提案ID取得 */
            const suggestionIdList = await suggestionDao.getPermissionSuggestionId().catch(err => console.log(err));

            /* 提案許可された提案があるか */
            if(suggestionIdList.length > 0){
                /* 提案許可された提案を実行する */
                for(let i = 0; i < suggestionIdList.length; i++){

                    switch (suggestionIdList[i]['type']) {

                        case this.TYPE_MOBILE:
                            //モバイル通知

                            //family_structure_id取得
                            const family_structure_id = await suggestionDao.getFamilyStructureId().catch(err => console.log(err));

                            //タイトル作成
                            let title = '';
                            if(suggestionIdList[i]['to_type'] !== 'ALL'){
                                const name = await suggestionDao.getFamilyStructureName(family_structure_id[0], suggestionIdList[i]['to_type']).catch(err => console.log(err));

                                title = name + 'の機嫌が悪いよ〜';
                            } else {
                                title = 'ALLだよ〜';
                            }

                            //t_noticeにデータ挿入
                            suggestionDao.insertNoticeData(family_structure_id, title, this.SAMPLE_NOTICE_CONTENTS).catch(err => console.log(err));
                            break;

                        case this.TYPE_RIGHT:
                            //ライトのRGB or pinkで色変更処理
                            //未検証部分
                            const led = new Led(1);
                            led.on();
                            led.setBrightness(led.MAX_BRIGHTNESS);
                            led.pink();
                            led.close();
                            // led.setColor();
                            break;

                        case this.TYPE_REFORM:
                            //アニメーション再生処理
                            app.socket.io.emit('url', suggestionIdList[i]['note']);
                            break;

                        case this.TYPE_TALK:
                            //喋らせる処理
                            app.socket.io.emit('voice', suggestionIdList[i]['note']);
                            break;
                    }
                }
            }
            resolve('success');
        });
    }
}