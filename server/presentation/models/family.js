/**
 * Created by kokikono on 2017/11/12.
 */
import mysql from 'mysql';
import Async from 'async';

export default class Family {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'happy_home',
        });
    }

    getModelFamily(familyId) {
        return new Promise((resolve, reject) => {
            this.connection.connect((connectErr) => {
                if (connectErr) reject(connectErr);
                this.connection.query(
                    'SELECT face_id FROM t_family_structure' +
                    ' INNER JOIN m_family' +
                    ' ON m_family.id = t_family_structure.family_id' +
                    ' WHERE m_family.id = ?',
                    [familyId],
                    (queryErr, results) => {
                        if (queryErr) reject(queryErr);
                        this.connection.end();
                        const response = [];
                        Async.each(results, (result) => {
                            response.push(result.face_id);
                        });
                        resolve(response);
                    },
                );
            });
        });
    }

    insertEmotion(familyId, jsonData, imagePath) {
        return new Promise((resolve, reject) => {
            this.connection.connect((connectErr) => {
                if (connectErr) reject(connectErr);
                this.connection.beginTransaction((beginTransactionErr) => {
                    if (beginTransactionErr) reject(beginTransactionErr);
                    this.connection.query(
                        'INSERT INTO t_emotion(family_id, json_data, image_path) VALUES(?, ?, ?)',
                        [familyId, jsonData, imagePath],
                        (queryErr, results) => {
                            if (queryErr) {
                                this.connection.rollback(() => (reject(queryErr)));
                            }
                            this.connection.commit((commitErr) => {
                                if (commitErr) {
                                    this.connection.rollback(() => (reject(commitErr)));
                                }
                                this.connection.end();
                                resolve(results.insertId);
                            });
                        },
                    );
                });
            });
        });
    }

    insertindividual(emotionId, jsonData, faceId) {
        return new Promise((resolve, reject) => {
            this.connection.connect((connectErr) => {
                if (connectErr) reject(connectErr);
                this.connection.beginTransaction((beginTransactionErr) => {
                    if (beginTransactionErr) reject(beginTransactionErr);
                    this.connection.query(
                        'INSERT INTO t_emotion_individual(emotion_id,json_data, face_id) VALUES(? ,?, ?)',
                        [emotionId, jsonData, faceId],
                        (queryErr) => {
                            if (queryErr) {
                                this.connection.rollback(() => (reject(queryErr)));
                            }
                            this.connection.commit((commitErr) => {
                                if (commitErr) {
                                    this.connection.rollback(() => (reject(commitErr)));
                                }
                                this.connection.end();
                                resolve();
                            });
                        },
                    );
                });
            });
        });
    }

    /**
     * timestampで最新のfamily情報を取得する。
     * @returns {Promise}
     */
    latestFamily() {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM m_family ORDER BY timestamp DESC LIMIT 1', (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    getFamilyStructre(familyId) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'SELECT * FROM t_family_structure WHERE family_id = ?',
                [familyId],
                (queryErr, results) => {
                    if (queryErr) reject(queryErr);
                    resolve(results);
                },
            );
        });
    }
    getEmotion(familyId) {
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

    getEmotionFromFaceId(emotionId, faceId) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'SELECT * FROM t_emotion_individual WHERE family_id = ? AND face_id = ?',
                [emotionId, faceId],
                (queryErr, results) => {
                    if (queryErr) reject(queryErr);
                    resolve(results);
                },
            );
        });
    }
}
