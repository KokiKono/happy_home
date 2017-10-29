/**
 * Created by kokikono on 2017/10/29.
 */
import Dao from './dao';

export default class FamilyDao extends Dao {
    insertFamily() {
        const sql = 'INSERT INTO m_family() VALUES()';
        return super.query(sql)
            .then((success) => {
                return success;
            })
            .catch((error) => {
                return error;
            });
    }
}