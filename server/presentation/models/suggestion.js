/**
 * Created by I.Asakawa on 2017/11/22.
 */
import mysql from 'mysql';
import Async from 'async';

export default class Suggestion {

    constructor(){
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'happy_home',
        });
    }

    getLatestScenePattern() {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'select t_s.scene, t_p.pattern, t_p.id as pattern_id from t_scene t_s' +
                ' inner join t_pattern t_p on t_s.id = t_p.scene_id' +
                ' ORDER BY t_p.timestamp DESC LIMIT 1',
                (queryErr, results) =>{
                    if (queryErr) reject(queryErr);
                    resolve(results);
                },
            );
        });
    }

    getPermissionSuggestionId(patternId){
        return new Promise((resolve, reject) => {
            this.connection.query(
                'select t_sp.suggestion_id, m_s.title, m_s.point, m_s.note, m_s.type, m_s.to_type, m_s.from_type from t_suggestion_permission t_sp ' +
                'inner join m_suggestion m_s on t_sp.suggestion_id = m_s.id where t_sp.pattern_id = ?',
                [patternId],
                (queryErr, results) =>{
                    if (queryErr) reject(queryErr);
                    resolve(results);
                },
            );
        });
    }

    insertNoticeData(family_structure_id, title, notice_contents) {
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction((beginTransactionErr) => {
                if (beginTransactionErr) reject(beginTransactionErr);
                this.connection.query(
                    'insert into t_notice(family_structure_id, title, notice_contents) values(?, ?, ?)',
                    [family_structure_id, title, notice_contents],
                    (queryErr, results) => {
                        if (queryErr) {
                            this.connection.rollback(() => (reject(queryErr)));
                        }
                        this.connection.commit((commitErr) => {
                            if (commitErr) {
                                this.connection.rollback(() => (reject(commitErr)));
                            }
                            resolve(results.insertId);
                        });
                    },
                );
            });
        });
    }

    insertNoticeSuggestion(noticeId, suggestionId) {
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction((beginTransactionErr) => {
                if (beginTransactionErr) reject(beginTransactionErr);
                this.connection.query(
                    'insert into t_notice_suggestion(notice_id, suggestion_id, receiving) values(?, ?, ?)',
                    [noticeId, suggestionId, false],
                    (queryErr, results) => {
                        if (queryErr) {
                            this.connection.rollback(() => (reject(queryErr)));
                        }
                        this.connection.query(
                            'SELECT id FROM m_suggestion_detail WHERE suggestion_id = ?',
                            [suggestionId],
                            async (selectErr, selectResults) => {
                                if (selectErr) return;
                                console.info(selectResults)
                                await Promise.all(selectResults.map((item) => {
                                    this.connection.query(
                                        'INSERT INTO t_suggestion_task(suggestion_detail_id, notice_id) VALUES(?,?)',
                                        [item.id, noticeId],
                                        (taskErr) => {
                                            console.error(taskErr);
                                        },
                                    );
                                }));
                            },
                        )
                        this.connection.commit((commitErr) => {
                            if (commitErr) {
                                this.connection.rollback(() => (reject(commitErr)));
                            }
                            resolve(results.insertId);
                        });
                    },
                );
            });
        });
    }

    inserSuggestionTask(suggestionDetailId, noticeId) {
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction((beginTransactionErr) => {
                if (beginTransactionErr) reject(beginTransactionErr);
                this.connection.query(
                    'insert into t_suggestion_task(suggestion_detail_id, notice_id) values(?, ?)',
                    [suggestionDetailId, noticeId],
                    (queryErr, results) => {
                        if (queryErr) {
                            this.connection.rollback(() => (reject(queryErr)));
                        }
                        this.connection.commit((commitErr) => {
                            if (commitErr) {
                                this.connection.rollback(() => (reject(commitErr)));
                            }
                            resolve(results.insertId);
                        });
                    },
                );
            });
        });
    }
    getFamilyStructureId(){
        return new Promise((resolve, reject) => {
            this.connection.query(
                'select id from m_family where timestamp = (select max(timestamp) from m_family)',
                (queryErr, results) =>{
                    if (queryErr) reject(queryErr);
                    const response = [];
                    Async.each(results, (result) => {
                        response.push(result.id);
                    });
                    resolve(response);
                },
            );
        });
    }

    getFamilyStructureName(family_id, type_name){
        return new Promise((resolve, reject) => {
            this.connection.query(
                'select name from t_family_structure where family_id = ? and type = ?',
                [family_id, type_name],
                (queryErr, results) =>{
                    if (queryErr) reject(queryErr);
                    const response = [];
                    Async.each(results, (result) => {
                        response.push(result.name);
                    });
                    resolve(response);
                },
            );
        });
    }
}