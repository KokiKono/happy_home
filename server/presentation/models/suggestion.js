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

    getPermissionSuggestionId(){
        return new Promise((resolve, reject) => {
            this.connection.query(
                'select t_sp.suggestion_id, m_s.title, m_s.point, m_s.note, m_s.type, m_s.to_type, m_s.from_type from t_suggestion_permission t_sp ' +
                'inner join m_suggestion m_s on t_sp.suggestion_id = m_s.id',
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