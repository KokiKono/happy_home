/**
 * Created by takai on 2017/11/09.
 */
import Dao from './dao';

export default class PointsModel extends Dao {
    select() {
        return super.query('SELECT * FROM m_point_earnings')
            .then((success) => {
                return success;
            })
            .catch((error) => {
                console.log(error);
                return error;
            })
    }

}