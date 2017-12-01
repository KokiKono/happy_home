/**
 * Created by kokikono on 2017/11/12.
 */
import mysql from 'mysql';

export default class Emotion {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'happy_home',
        });
    }

    getLatestEmotions(familyId) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'SELECT * FROM t_emotion WHERE family_id = ?',
                [familyId],
                (queryErr, results) => {
                    if (queryErr) reject(queryErr);
                    resolve(results);
                },
            );
        });
    }

    getEmotionIndividuals(emotionId) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'SELECT * FROM t_emotion_individual WHERE emotion_id = ?',
                [emotionId],
                (queryErr, results) => {
                    if (queryErr) reject(queryErr);
                    resolve(results);
                },
            );
        });
    }
}