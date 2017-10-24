/**
 * Created by kokikono on 2017/10/24.
 */
import Dao from './dao';

export default class SampleModel extends Dao {
    select() {
        return super.query('SELECT * FROM sample')
            .then((success) => {
                return success;
            })
            .catch((error) => {
                console.log(error);
                return error;
            });
    }
}
