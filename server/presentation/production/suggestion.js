/**
 * 提案ロジック部分
 * Created by I.Asakawa on 2017/11/22.
 */

import SuggestionDao from '../models/suggestion';
import FamilyDao from '../models/family';
import SuggestionPermissionDao from '../models/suggestionPermision';
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

        this.ANGER_TITLE = 'toTypeがdegree怒っています。';
        this.CONTEMP_TITLE = 'toTypeがdegree軽蔑感を抱いています。';
        this.DISGUST_TITLE = 'toTypeがdegree嫌なことがあったみたいです。';
        this.FEAR_TITLE = 'toTypeがdegree怖がっています。';
        this.NEUTRAL_TITLE = 'toTypeの機嫌がdegree悪いみたいです。';
        this.SADNESS_TITLE = 'toTypeがdegree悲しんでいます。';
        this.HAPPINESS_TITLE = 'toTypeがdegree幸せを感じています';
        this.SURPRISE_TITLE = 'toTypeにdegreeな驚きがあったみたいです。';
    }

    start(app){
        return new Promise(async (resolve, reject) => {

            const suggestionDao = new SuggestionDao();
            const familyDao = new FamilyDao();

            const latestScenePattern = await suggestionDao.getLatestScenePattern()
                .catch(err => reject(err));
            /* 提案許可されている提案ID取得 */
            const suggestionIdList = await suggestionDao
                .getPermissionSuggestionId(latestScenePattern[0].pattern_id)
                .catch((err) => { reject(err); });
            // 提案タイプごとにまとめる
            const suggestionIds = {
                mobile: [],
                light: [],
                reform: [],
                talk: [],
            };
            suggestionIdList.forEach((element) => {
                suggestionIds[element.type].push(element);
            });
            // return;
            /* 提案許可された提案があるか */
            if (suggestionIdList.length > 0) {
                /* 提案許可された提案を通知する */
                if (suggestionIds.mobile.length > 0) {
                    // 最も判断の多い提案を取得する。
                    const modelSuggestion = suggestionIds.mobile[0];
                    const latestFamily = await familyDao.latestFamily().catch(err => reject(err));
                    const familys = await familyDao.getFamilyStructre(latestFamily[0].id)
                        .catch(err => reject(err));
                    // 提案判断の取得
                    const suggestionPermissionDao = new SuggestionPermissionDao();
                    const judgments = await suggestionPermissionDao
                        .getJudgmentAll(modelSuggestion.suggestion_id)
                        .catch(err => reject(err));
                    const descJudgments = judgments.sort((a, b) => a.val < b.val);

                    // family_structure_id取得
                    const toType = modelSuggestion.to_type;
                    const fromType = modelSuggestion.from_type;
                    let title = '';
                    switch (descJudgments[0].key_name) {
                        case 'anger': {
                            title = this.ANGER_TITLE;
                            break;
                        }
                        case 'contempt': {
                            title = this.CONTEMP_TITLE;
                            break;
                        }
                        case 'disgust': {
                            title = this.DISGUST_TITLE;
                            break;
                        }

                        case 'fear': {
                            title = this.FEAR_TITLE;
                            break;
                        }
                        case 'happiness': {
                            title = this.HAPPINESS_TITLE;
                            break;
                        }
                        case 'neutral': {
                            title = this.NEUTRAL_TITLE;
                            break;
                        }
                        case 'sadness': {
                            title = this.SADNESS_TITLE;
                            break;
                        }
                        case 'surprise': {
                            title = this.SURPRISE_TITLE;
                            break;
                        }
                        default: {
                            title = 'toTypeのことで提案があります。';
                        }
                    }
                    switch (true) {
                        case (descJudgments[0].val > 0.8): {
                            title = title.replace('degree', 'ものすごく');
                            break;
                        }
                        case (descJudgments[0].val > 0.6 && descJudgments[0].val <= 0.8): {
                            title = title.replace('degree', 'とても');
                            break;
                        }
                        case (descJudgments[0].val > 0.3 && descJudgments[0].val <= 0.6): {
                            title = title.replace('degree', 'すこし');
                            break;
                        }
                        case (descJudgments[0].val > 0.1 && descJudgments[0].val <= 0.3): {
                            title = title.replace('degree', '気にするほどでもありませんが、');
                            break;
                        }
                        default: {
                            title = title.replace('degree', '');
                            break;
                        }
                    }
                    // 対象家族がALLの場合は全員に通知を送る
                    if (toType === 'ALL') {
                        title = title.replace('toType', '家族');
                        familys.forEach(async (element) => {
                            // t_noticeにデータ挿入
                            const insertId = await suggestionDao
                                .insertNoticeData(element.id, title, this.SAMPLE_NOTICE_CONTENTS)
                                .catch((err) => { reject(err); });
                            await suggestionDao
                                .insertNoticeSuggestion(insertId, modelSuggestion.suggestion_id);
                        });
                    } else {
                        // 対象家族に通知を送る
                        const familyStructure = familys.find(element => element.type === toType);
                        if (typeof familyStructure === 'undefined') return;
                        title = title.replace('toType', familyStructure.name);
                        // t_noticeにデータ挿入
                        await Promise.all(familys.map(async (familyItem) => {
                            if (fromType !== 'ALL') {
                                if (familyItem.type !== fromType) {
                                    console.warn('skip');
                                    return;
                                }
                            }
                            const insertId = await suggestionDao.insertNoticeData(
                                familyItem.id,
                                title,
                                this.SAMPLE_NOTICE_CONTENTS,
                            ).catch(err => {
                                console.error(err);
                                reject(err);
                            });
                            suggestionIds.mobile.forEach(async (item) => {
                                await suggestionDao
                                    .insertNoticeSuggestion(insertId, item.suggestion_id)
                                    .catch(err => console.error(err));
                            });
                        }));
                    }
                }
                // ライト
                suggestionIds.light.forEach((item) => {
                    // ライトのRGB or pinkで色変更処理
                    // 未検証部分
                    const led = new Led(1);
                    const led3 =  new Led(3);
                    led.on();
                    led.setBrightness(led.MAX_BRIGHTNESS);
                    led3.on();
                    led3.setBrightness(led3.MAX_BRIGHTNESS)
                    switch (item.note) {
                        case 'pink': {
                            led.pink();
                            led3.pink();
                            break;
                        }
                        case 'white': {
                            led.white();
                            led3.white();
                            break;
                        }
                        default: {
                            led.night();
                            led3.night();
                            break;
                        }
                    }
                    led.close();
                    led3.close();
                    // led.setColor();
                });
                // リフォーム
                suggestionIds.reform.forEach((item) => {
                    app.socket.io.emit('url', item['note']);
                });
                // talk
                suggestionIds.talk.forEach((item) => {
                    app.socket.io.emit('voice', item['note']);
                });
            }
            resolve('success');
        });
    }
}