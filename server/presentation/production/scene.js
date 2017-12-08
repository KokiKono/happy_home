/**
 * Created by kokikono on 2017/12/01.
 */
import deepEqual from 'deep-equal';
import PresentationModel from '../models/presentation';
import FamilyModel from '../models/family';

const pageUrl = 'http://localhost:8080/main/select_scene';

const run = app => (
    new Promise(async (resolve, reject) => {
        try {
            const familyModel = new FamilyModel();
            const latestFamily = await familyModel.latestFamily();
            familyModel.end();
            const presentationModel = new PresentationModel();
            const latestScene = await presentationModel.getLatestScene(latestFamily[0].id);
            // main画面をシーン選択にする。
            app.socket.io.emit('url', pageUrl);
            require('waitjs'); // eslint-disable-line
            return repeat('5 secs', async () => { // eslint-disable-line
                console.log('watch scene');
                const nextScene = await presentationModel.getLatestScene(latestFamily[0].id);
                if (!deepEqual(latestScene, nextScene)) {
                    console.log('end scene');
                    clear('watch_db'); // eslint-disable-line
                    return resolve('sccess');
                }
            }, 'watch_db');
        } catch (err) {
            return reject(err);
        }
    })
);

export default run;
