/**
 * Created by kokikono on 2017/11/13.
 */
import deepEqual from 'deep-equal';
import FamilyModel from '../models/family';
require('waitjs');
const pageUrl = 'http://localhost:8080/main/family_list';

const createFamily = (app) => {
    return new Promise(async (resolve, reject) => {
        const familyModel = new FamilyModel();
        // 現在のfamilyIdの最大値を取得
        const latestFamily = await familyModel.latestFamily().catch(err => reject(err));
        familyModel.end();
        // main画面を家族構成画面にする。
        app.socket.io.emit('url', pageUrl);
        repeat('5 secs', async () => {
            console.log('watch createFamily');
            const nextFamilyModel = new FamilyModel();
            const nextFamily = await nextFamilyModel.latestFamily();
            console.log(latestFamily);
            console.log(nextFamily);
            if (!deepEqual(latestFamily, nextFamily)) {
                console.log('end createFamily');
                clear('watch_db');
                resolve('success');
            }
        }, 'watch_db');
    });
};

export default createFamily;
