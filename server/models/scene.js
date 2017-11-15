/**
 * Created by kokikono on 2017/11/15.
 */
import Dao from './dao';

export default class Scene extends Dao {
    insertScene(familyId, scene) {
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction((transactionError) => {
                if (transactionError) reject(transactionError);
                this.connection.query(
                    'INSERT INTO t_scene(family_id, scene) VALUES(?, ?)',
                    [familyId, scene],
                    (queryErr) => {
                        if (queryErr) {
                            this.connection.rollback((rollbackErr) => {
                                if (rollbackErr) reject(rollbackErr);
                            });
                            reject(queryErr);
                        }
                        this.connection.commit((commitErr) => {
                            if (commitErr) reject(commitErr);
                        });
                        resolve();
                    },
                );
            });
        });
    }
}