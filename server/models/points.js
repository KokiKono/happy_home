/**
 * Created by takai on 2017/11/09.
 */
import Dao from './dao';
import SuggestionDao from './suggestion';

export default class PointsModel extends Dao {
    select() {
        return super.query('SELECT DISTINCT m_suggestion.id AS id, m_suggestion.tag_icon AS tag_icon, m_suggestion.title AS contents, m_suggestion.point AS point, t_family_structure.family_icon AS family_icon FROM m_suggestion INNER JOIN t_suggestion_permission ON t_suggestion_permission.suggestion_id = m_suggestion.id INNER JOIN t_pattern ON t_pattern.id = t_suggestion_permission.pattern_id INNER JOIN t_scene ON t_scene.id = t_pattern.scene_id INNER JOIN m_family ON m_family.id = t_scene.family_id INNER JOIN t_family_structure ON t_family_structure.family_id = m_family.id WHERE t_scene.id = (SELECT id FROM t_scene ORDER BY timestamp DESC LIMIT 1) AND t_pattern.id = (SELECT id FROM t_pattern ORDER BY timestamp DESC LIMIT 1)')
            .then((success) => {
                return success;
            })
            .catch((error) => {
                console.log(error);
                return error;
            });
    }

    receivingPoint(familyStructureId, suggestionId) {
        if (this.isEnd) super.createConnection();
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction(async (transactionError) => {
                if (transactionError) {
                    return reject(transactionError);
                }
                const suggestionDao = new SuggestionDao();
                const suggestion = await suggestionDao.selectSuggestion(suggestionId);
                if (suggestion.results.length === 0) {
                    const err = new Error('suggestion not found');
                    err.status = 404;
                    return reject(err);
                }
                const suggestionResult = suggestion.results[0];
                this.connection.query(
                    'INSERT INTO t_notice(' +
                    'family_structure_id,' +
                    'title,' +
                    'notice_contents' +
                    ') VALUES(?, ?, ?)',
                    [familyStructureId, 'ポイント稼ぎを受け付けました。', `${suggestionResult.title}をして${suggestionResult.type}を幸せにしましょう。`],
                    (queryErr, results) => {
                        if (queryErr) {
                            this.connection.rollback();
                            reject(queryErr);
                        } else {
                            this.connection.query(
                                'INSERT INTO t_notice_suggestion(' +
                                'notice_id,' +
                                'suggestion_id,' +
                                'receiving' +
                                ') VALUES(' +
                                '?, ?, ?)',
                                [results.insertId, suggestionId, true],
                                (queryErr2) => {
                                    if (queryErr2) {
                                        this.connection.rollback();
                                        reject(queryErr2);
                                    } else {
                                        this.connection.commit();
                                        super.end();
                                        resolve({
                                            suggestion_id: suggestionId,
                                            notice_id: results.insertId,
                                        });
                                    }
                                },
                            );
                        }
                    },
                );
            });
        });
    }
}
