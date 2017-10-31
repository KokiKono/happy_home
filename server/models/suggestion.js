/**
 * Created by I.Asakawa on 2017/10/31.
 */
import Dao from './dao';

export default class SuggestionModel extends Dao {
    selectSuggestionDetail(suggestion_id) {
        return super.query('')
            .then((success) => {
                return success;
            })
            .catch((error) => {
                console.log(error);
                return error;
            })
    }
}
