/**
 * Created by takai on 2017/10/27.
 */
import Dao from './dao';

export default class NoticeNewModel extends Dao {
    select() {
        return super.query('SELECT t_notice.id, t_notice.family_structure_id, t_notice.title, t_notice_suggestion.suggestion_id FROM t_notice INNER JOIN t_notice_suggestion ON t_notice.id = t_notice_suggestion.notice_id')
            .then((success) => {
                return success;
            })
            .catch((error) => {
                console.log(error);
                return error;
            });
    }

    selectAtId(id) {
        return super.query('SELECT t_notice.id, t_notice.family_structure_id, t_notice.title, t_notice.notice_contents, t_notice.result_contents, m_suggestion.id as suggestion_id, m_suggestion.title as suggestion_title FROM t_notice INNER JOIN t_notice_suggestion ON t_notice.id = t_notice_suggestion.notice_id INNER JOIN m_suggestion ON t_notice_suggestion.suggestion_id = m_suggestion.id WHERE t_notice.id = ?', [id])
            .then((success) => {
                return success;
            })
            .catch((error) => {
                console.log(error);
                return error;
            });
    }
}