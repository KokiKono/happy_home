/**
 * Created by takai on 2017/11/07.
 */
import Dao from './dao';

export default class NoticeOldModel extends Dao {
    constructor(familyId, structureId) {
        super();
        this.familyId = familyId;
        this.structureId = structureId;
    }
    select() {
        return super.query('SELECT t_notice.id, t_notice.family_structure_id, t_notice.title FROM t_notice WHERE is_old = true OR is_skip = true AND family_structure_id = ?', [this.structureId])
            .then((success) => {
                return success;
            })
            .catch((error) => {
                console.log(error);
                return error;
            })
    }

    selectAtId(id) {
        return super.query('SELECT t_notice.id, t_notice.family_structure_id, t_notice.title, t_notice.notice_contents, t_notice.result_contents, m_suggestion.id as suggestion_id, m_suggestion.title as suggestion_title FROM t_notice LEFT OUTER JOIN t_notice_suggestion ON t_notice.id = t_notice_suggestion.notice_id LEFT OUTER JOIN m_suggestion ON t_notice_suggestion.suggestion_id = m_suggestion.id WHERE is_old = true AND t_notice.id = ?', [id])
        .then((success) => {
            return success;
        })
        .catch((error) => {
            console.log(error);
            return error;
        });
    }
}