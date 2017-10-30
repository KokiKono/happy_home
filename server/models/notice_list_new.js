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
            })
    }
}