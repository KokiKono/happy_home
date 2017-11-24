/**
 * Created by takai on 2017/11/22.
 */
import Dao from './dao';

export default class FamilyListModel extends Dao {
    select() {
        return super.query('SELECT id, face_id, image_path FROM face_relation')
        .then((success) => {
            return success;
        })
        .catch((error) => {
            console.log(error);
            return error;
        })
    }
}