/**
 * Created by kokikono on 2017/11/09.
 */
import mysql from 'mysql';

export default class TmpFaceAPI {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'happy_home',
        });
    }
    delete() {
        return new Promise((resolve, reject) => {
            this.connection.connect((connectErr) => {
                if (connectErr) reject(connectErr);
                this.connection.beginTransaction((beginTransactionErr) => {
                    if (beginTransactionErr) reject(beginTransactionErr);
                    this.connection.query(
                        'DELETE FROM tmp_faceAPI',
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

    insert(imagePath, jsonData) {
        return new Promise((resolve, reject) => {
            this.connection.connect((connectErr) => {
                if (connectErr) reject(connectErr);
                this.connection.beginTransaction((beginTransactionErr) => {
                    if (beginTransactionErr) reject(beginTransactionErr);
                    this.connection.query(
                        'INSERT INTO tmp_faceAPI(image_path, json_data) VALUES(?, ?)',
                        [imagePath, jsonData],
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
}
