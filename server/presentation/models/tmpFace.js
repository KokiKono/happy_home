/**
 * Created by kokikono on 2017/11/11.
 */
import mysql from 'mysql';

export default class TmpFace {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'happy_home',
        });
    }
    close() {
        this.connection.end();
    }
    insertRelation(modeFaceID, imagePath, jsonData) {
        return new Promise((resolve, reject) => {
            this.connection.connect((connectErr) => {
                if (connectErr) reject(connectErr);
                this.connection.beginTransaction((beginTransactionErr) => {
                    if (beginTransactionErr) reject(beginTransactionErr);
                    this.connection.query(
                        'INSERT INTO face_relation(face_id, image_path, json_data) VALUES(?, ?, ?)',
                        [modeFaceID, imagePath, jsonData],
                        (queryErr, results) => {
                            if (queryErr) {
                                this.connection.rollback(() => (reject(queryErr)));
                            }
                            this.connection.commit((commitErr) => {
                                if (commitErr) {
                                    this.connection.rollback(() => (reject(commitErr)));
                                }
                                this.connection.end();
                                resolve(results);
                            });
                        },
                    );
                });
            });
        });
    }

    insertGroup(relationId, faceId) {
        return new Promise((resolve, reject) => {
            this.connection.connect((connectErr) => {
                if (connectErr) reject(connectErr);
                this.connection.beginTransaction((beginTransactionErr) => {
                    if (beginTransactionErr) reject(beginTransactionErr);
                    this.connection.query(
                        'INSERT INTO tmp_face_group(face_relation_id, face_id) VALUES(?, ?)',
                        [relationId, faceId],
                        (queryErr, results) => {
                            if (queryErr) {
                                this.connection.rollback(() => (reject(queryErr)));
                            }
                            this.connection.commit((commitErr) => {
                                if (commitErr) {
                                    this.connection.rollback(() => (reject(commitErr)));
                                }
                                this.connection.end();
                                resolve(results);
                            });
                        },
                    );
                });
            });
        });
    }
}