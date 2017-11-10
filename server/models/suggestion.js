/**
 * Created by I.Asakawa on 2017/11/06.
 */
import Dao from './dao';

export default class SuggestionModel extends Dao {

    selectSuggestion(suggestion_id) {
        return super.query('select id, title, point from m_suggestion where id = ?',[suggestion_id])
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
            this.connection.query('select m_sd.id as id, m_sd.task_contents as task_contents, '
            +'(select COALESCE(done, 0) from m_suggestion_detail sub_sd left outer join t_suggestion_task sub_st on sub_sd.id = sub_st.suggestion_detail_id '
            +'where sub_sd.suggestion_id = ?  AND sub_st.notice_id = ?) as done from m_suggestion_detail m_sd '
            +'left outer join t_suggestion_task t_st on m_sd.id = t_st.suggestion_detail_id  where m_sd.suggestion_id = ?',
            [suggestion_id, notice_id, suggestion_id], (error, results) => {
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
}
