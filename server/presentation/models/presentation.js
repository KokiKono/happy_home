/**
 * Created by kokikono on 2017/12/01.
 */
import mysql from 'mysql';

export default class Presentation {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'happy_home',
        });
    }

    getLatestScene(familyId) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'SELECT * FROM t_scene WHERE family_id = ? ORDER BY timestamp DESC LIMIT 1',
                [familyId],
                (queryErr, results) => {
                    if (queryErr) reject(queryErr);
                    resolve(results);
                },
            );
        });
    }

    getLatestPattern(patternId) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'SELECT * FROM t_pattern WHERE scene_id = ? ORDER BY timestamp DESC LIMIT 1',
                [patternId],
                (queryErr, results) => {
                    if (queryErr) reject(queryErr);
                    resolve(results);
                },
            );
        });
    }
}