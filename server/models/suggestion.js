/**
 * Created by I.Asakawa on 2017/11/06.
 */
import Dao from './dao';

export default class SuggestionModel extends Dao {
    selectAllSuggestion() {
        return super.query('select id, title, point, type, tag_icon, note, to_type, from_type from m_suggestion')
            .then((success) => {
                return success;
            })
            .catch((error) => {
                console.log(error);
                return error;
            });
    }
    selectSuggestion(suggestion_id) {
        return super.query('select id, title, point, type from m_suggestion where id = ?',[suggestion_id])
            .then((success) => {
                return success;
            })
            .catch((error) => {
                console.log(error);
                return error;
            })
    }

    selectSuggestionTask(suggestion_id, notice_id) {
        return new Promise((resolve, reject) => {
            this.connection.query('select m_sd.id as id, m_sd.task_contents as task_contents, m_sd.title as title, COALESCE(done, 0) as done ' +
            'from t_suggestion_task t_st ' +
            'inner join t_notice t_n on t_st.notice_id = t_n.id ' +
            'inner join m_suggestion_detail m_sd on t_st.suggestion_detail_id = m_sd.id ' +
            'inner join m_suggestion m_s on m_sd.suggestion_id = m_s.id ' +
            'where m_s.id = ? and t_n.id = ?',
            [suggestion_id, notice_id], (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    selectFamilyStructure(family_structure_id, family_id) {
        return new Promise((resolve, reject) => {
            this.connection.query('select name, type from t_family_structure where id = ? and family_id = ?',
            [family_structure_id, family_id], (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    isReceiving(noticeId, suggestionId) {
        return super.query('SELECT' +
            ' receiving' +
            ' FROM t_notice_suggestion' +
            ' WHERE' +
            ' notice_id = ?' +
            ' AND' +
            ' suggestion_id = ?',
            [noticeId, suggestionId],
        )
            .then((success) => {
                if (success.results.length === 0) return false;
                if (success.results[0].receiving) {
                    return true;
                }
                return false;
            })
            .catch((err) => {
                return err;
            });
    }

    selectNoticeSuggestion(noticeId, suggestionId) {
        if (this.isEnd) super.createConnection();
        return new Promise((resolve, reject) => {
            this.connection.query(
                'SELECT * FROM t_notice_suggestion' +
                ' WHERE notice_id = ?' +
                ' AND suggestion_id = ?',
                [noticeId, suggestionId],
                (queryErr, results) => {
                    if (queryErr) reject(queryErr);
                    resolve(results);
                },
            );
        });
    }

    updateReceiving(noticeSuggestionId, receiving) {
        if (this.isEnd) super.createConnection();
        return new Promise(async (resolve, reject) => {
            this.connection.beginTransaction(async (transactionError) => {
                if (transactionError) {
                    return reject(transactionError);
                }
                this.connection.query(
                    'UPDATE t_notice_suggestion SET receiving = ? WHERE id = ?',
                    [receiving, noticeSuggestionId],
                    (queryErr) => {
                        if (queryErr) {
                            this.connection.rollback();
                            reject(queryErr);
                        } else {
                            this.connection.commit();
                            resolve(true);
                        }
                    },
                );
            });
        });
    }

    selectSuggestionDetail(suggestionDetailId) {
        return this.query(
            'SELECT id, suggestion_id, task_contents' +
            ' FROM m_suggestion_detail' +
            ' WHERE id = ?',
            [suggestionDetailId],
            )
            .then(success => success)
            .catch(err => err);
    }

    selectSuggestionDetails(suggestionId) {
        return super.query(
            'SELECT * FROM m_suggestion_detail WHERE suggestion_id = ?',
            [suggestionId],
        );
    }
    /**
     * 現在進行中の提案通知
     * @param familyStructureId
     */
    nowSuggestions(familyStructureId) {
        return this.query(
            'SELECT s.id AS id, s.title AS title, n.id AS notice_id' +
            ' FROM t_notice n' +
            ' INNER JOIN t_notice_suggestion ns' +
            ' ON n.id = ns.notice_id' +
            ' INNER JOIN m_suggestion s' +
            ' ON s.id = ns.suggestion_id' +
            ' WHERE ns.receiving = true' +
            ' AND n.is_old = false' +
            ' AND n.is_skip = false' +
            ' AND n.family_structure_id = ?',
            [familyStructureId],
        )
            .then(success => success)
            .catch(err => err);
    }

    toggleSuggestionTask(suggestionDetailId, noticeId, isDone) {
        if (this.isEnd) super.createConnection();
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction(async (transactionError) => {
                if (transactionError) {
                    return reject(transactionError);
                }
                this.connection.query(
                    'INSERT INTO' +
                    ' t_suggestion_task(suggestion_detail_id, notice_id, done)' +
                    ' VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE' +
                    ' done = ?',
                    [suggestionDetailId, noticeId, isDone, isDone],
                    (queryErr) => {
                        if (queryErr) {
                            this.connection.rollback();
                            reject(queryErr);
                        } else {
                            this.connection.commit();
                            resolve('success');
                        }
                    },
                );
            });
        });
    }

    selectJudgment(suggestionId) {
        return super.query(
            'SELECT * FROM t_suggestion_judgment WHERE suggestion_id = ?',
            [suggestionId],
        );
    }

    insertJudgment(suggestionId, keyName, val) {
        if (this.isEnd) super.createConnection();
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction((transactionErr) => {
                if (transactionErr) reject(transactionErr);
                this.connection.query(
                    'INSERT INTO t_suggestion_judgment(' +
                    'suggestion_id,' +
                    'key_name,' +
                    'val' +
                    ') VALUES(' +
                    '?,' +
                    '?,' +
                    '?' +
                    ')',
                    [suggestionId, keyName, val],
                    (queryErr) => {
                        if (queryErr) {
                            this.connection.rollback();
                            super.end();
                            reject(queryErr);
                        } else {
                            this.connection.commit();
                            super.end();
                            resolve('success');
                        }
                    },
                );
            });
        });
    }
    insertSuggestion(title, point, note, type, tagIcon) {
        if (this.isEnd) super.createConnection();
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction((transactionErr) => {
                if (transactionErr) reject(transactionErr);
                this.connection.query(
                    'INSERT INTO m_suggestion(' +
                    'title,' +
                    'point,' +
                    'note,' +
                    'type,' +
                    'tag_icon' +
                    ') VALUES(' +
                    '?,' +
                    '?,' +
                    '?,' +
                    '?,' +
                    '?' +
                    ')',
                    [title, point, note, type, tagIcon],
                    (queryErr) => {
                        if (queryErr) {
                            this.connection.rollback();
                            reject(queryErr);
                        } else {
                            this.connection.commit();
                            resolve('success');
                        }
                    },
                );
            });
        });
    }

    selectAllEmotion() {
        return super.query('SELECT * FROM t_emotion');
    }


    selectSuggestionDone(noticeId) {
        if (this.isEnd) super.createConnection();
        return new Promise((resolve, reject) => {
            this.connection.query(
                'select t_st.done, m_s.point, t_n.family_structure_id from t_suggestion_task t_st '
                + 'inner join m_suggestion_detail m_sd on t_st.suggestion_detail_id = m_sd.id '
                + 'inner join m_suggestion m_s on m_sd.suggestion_id = m_s.id '
                + 'inner join t_notice t_n on t_st.notice_id = t_n.id '
                + 'where t_st.notice_id = ?',
                [noticeId],
                (queryErr, results) => {
                    if (queryErr) reject(queryErr);
                    resolve(results);
                },
            );
        });
    }

    insertLovePoint(family_structure_id, point, notice_id) {
        if (this.isEnd) super.createConnection();
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction((transactionErr) => {
                if (transactionErr) reject(transactionErr);
                this.connection.query(
                    'insert into t_love_number(family_structure_id, point, notice_id) values(?, ?, ?)',
                    [family_structure_id, point, notice_id],
                    (queryErr) => {
                        if (queryErr) {
                            this.connection.rollback();
                            reject(queryErr);
                        } else {
                            this.connection.commit();
                            resolve('success');
                        }
                    },
                );
            });
        });
    }
}

