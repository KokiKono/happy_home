/**
 * Created by I.Asakawa on 2017/10/31.
 */
import Dao from './dao';

export default class SuggestionModel extends Dao {
    selectSuggestionDetail(suggestion_id) {
        return super.query('select s.id as s_id, s.title, s.point, sd.id as sd_id, sd.suggestion_id, sd.task_contents from m_suggestion s inner join m_suggestion_detail sd on s.id = sd.suggestion_id where s.id = ?', [suggestion_id])
            .then((success) => {
                return success;
            })
            .catch((error) => {
                console.log(error);
                return error;
            })
    }
}
