/**
 * Created by kokikono on 2017/11/22.
 */
import mysql from 'mysql';

export default class SuggestionPermision {
    constructor() {
       this.connection = mysql.createConnection({
           host: 'localhost',
           user: 'root',
           password: '',
           database: 'happy_home',
       });
    }

    insertPermistion(patternId, suggestionId) {
        return new Promise((resolve, reject) => {
            this.connection.connect((connectErr) => {
                if (connectErr) reject(connectErr);
                this.connection.query(
                    'INSERT INTO t_suggestion_permission(pattern_id, suggestion_id)' +
                    ' VALUES(?, ?)',
                    [patternId, suggestionId],
                    (queryErr, results) => {
                        if (queryErr) {
                            this.connection.rollback(() => reject(queryErr));
                        }
                        this.connection.commit((commitErr) => {
                            if (commitErr) {
                                this.connection.rollback(() => reject(commitErr));
                            }
                            this.connection.end();
                            reject(results.insertId);
                        });
                    },
                );
            });
        });
    }

    getSuggestionAll() {
        return new Promise((resolve, reject) => {
            this.connection.connect((connectErr) => {
                if (connectErr) reject(connectErr);
                this.connection.query(
                    'SELECT * FROM m_suggestion',
                    (queryErr, results) => {
                        if (queryErr) reject(queryErr);
                        resolve(results);
                    },
                );
            });
        });
    }

    getJudgmentAll(suggestionId) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'SELECT * FROM t_suggestion_judgment WHERE suggestion_id = ?',
                [suggestionId],
                (queryErr, results) => {
                    if (queryErr) reject(queryErr);
                    resolve(results);
                },
            );
        });
    }
}
