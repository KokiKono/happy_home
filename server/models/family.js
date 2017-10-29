/**
 * Created by kokikono on 2017/10/29.
 */
import Dao from './dao';

export default class FamilyDao extends Dao {

    insertFamily() {
        return new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO m_family() VALUES()', (queryError, results) => {
                if (queryError) {
                    return reject(queryError);
                }
                return resolve(results);
            });
        });
    }

    insertFamilyStructre(familyId, structreList) {
        return new Promise((resolve, reject) => {
            let result = false;
            structreList.some((item) => {
                this.connection.query(
                    'INSERT INTO t_family_structure(family_id, name, type) VALUES(?, ?, ?)',
                    [familyId, item.name, item.type],
                    (error) => {
                        if (error) {
                            result = error;
                        }
                    },
                );
            });
            if (result) {
                return reject(result);
            }
            return resolve(true);
        });
    }

     postFamily(familyList) {
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction(async (transactionError) => {
                if (transactionError) {
                    return reject(transactionError);
                }
                // 家族登録
                const insertFamilyResult = await this.insertFamily().catch((e) => {
                    const error = new Error('post family insertId not found')
                    return reject(error);
                });
                if (!insertFamilyResult.insertId) {
                    this.connection.rollback();
                    const error = new Error('post family insertId not found')
                    return reject(error);
                }
                // 家族構成登録
                await this.insertFamilyStructre(insertFamilyResult.insertId, familyList)
                    .catch(() => {
                        this.connection.rollback();
                        const error = new Error('insert family structure error');
                        return reject(error);
                    });
                this.connection.commit();
                return resolve('ok');
            });
        });
    }
}
