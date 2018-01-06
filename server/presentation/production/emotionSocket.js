/**
 * Created by kokikono on 2017/12/01.
 */
import * as path from 'path';
import FamilyModel from '../models/family';
import EmotionModel from '../models/emotion';
import typeColor from '../../type_color.json';
import configFile from '../../../config.json';

const config = configFile[process.env.NODE_ENV];

const run = async (app) => {
    try {
        const familyModel = new FamilyModel();
        const latestFamily = await familyModel.latestFamily();
        // 最新感情取得
        const emotionModel = new EmotionModel();
        const latestEmotions = await emotionModel.getLatestEmotions(latestFamily[0].id);
        const modelEmotions = await emotionModel.getLatestEmotionAVGWidthFaceId(latestFamily[0].id);
        console.log(modelEmotions)
        // ソケットで飛ばすデータ
        const socketGrafData = {};
        const socketImagedata = [];
        // 家族構成ごとの感情データの取得
        const familyStructure = await familyModel.getFamilyStructre(latestFamily[0].id);
        Promise.all(familyStructure.map((item) => {
            const emotion = modelEmotions.find(element => element.face_id === item.face_id);
            // マイナス値の取得
            const minusKeys = ['anger', 'neutral', 'contempt'];
            const minusList = minusKeys.map(key => emotion.emotion[key]);
            const minus = minusList.sort((a, b) => a < b)[0];
            socketGrafData[item.name] = {
                minus: minus * -100,
                num: emotion.emotion.happiness * 100,
                color: typeColor[item.type],
            };
            const imageData = [];
            imageData.push(item.name);
            Object.keys(emotion.emotion).forEach((element) => {
                imageData.push(emotion.emotion[element]);
            });
            socketImagedata.push(imageData);
            return true;
        }));

        const emotionModel2 = new EmotionModel();
        const lovePoint = await emotionModel2.getLovePoint(latestFamily[0].id)
            .catch(err => console.error(err));
        console.warn(lovePoint)
        socketGrafData['幸せ指数'] = {
            num: lovePoint[0].point,
        };
        console.log('socketGrafData')
        console.log(socketGrafData)
        // setInterval(() => {
        //     app.socket.io.emit('graph update', socketGrafData);
        //     app.socket.io.emit('image update', `http://${config.server.url}:8080/public/images/${path.basename(latestEmotions[0].image_path)}`, socketImagedata);
        // }, 5000)
        app.socket.io.emit('graph update', socketGrafData);
        app.socket.io.emit('image update', `http://${config.server.url}:8080/public/images/${path.basename(latestEmotions[1].image_path)}`, socketImagedata);
        return 'emotion socket success';
    } catch (err) {
        return err;
    }
}


export default run;
