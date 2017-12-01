/**
 * Created by kokikono on 2017/11/27.
 */
import Dao from './dao';
import FamilyModel from './family';

export default class Emotion extends Dao {
    getLatestEmotion() {
        return new Promise(async (resolve, reject) => {
            const familyModel = new FamilyModel();
            const latestFamily = await familyModel.latestFamily()
                .catch(err => reject(err));
            const emotion = await this.getEmotion(latestFamily.results[0].id)
                .catch(err => reject(err));
            resolve(emotion.results);
        });
    }
    getEmotion(familyId) {
        return super.query(
            'SELECT * FROM t_emotion WHERE family_id = ?',
            [familyId],
        );
    }
}