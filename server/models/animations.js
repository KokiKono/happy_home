/**
 * Created by kokikono on 2017/11/15.
 */
import Dao from './dao';
export default class Animation extends Dao {
    updateAnimation(type) {
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction(async (transactionError) => {
                if (transactionError) {
                    return reject(transactionError);
                }
                const latestAnimation = await this.latestAnimation();
                console.log(latestAnimation);
                this.connection.query(
                    'UPDATE animation_management SET type = ? ' +
                    'WHERE id = ?',
                    [type, latestAnimation[0].id],
                    (queryErr) => {
                        if (queryErr) reject(queryErr);
                    },
                )
                this.connection.commit();
                resolve();
            });
        });
    }
    latestAnimation() {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM animation_management ORDER BY timestamp DESC LIMIT 1', (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }
}