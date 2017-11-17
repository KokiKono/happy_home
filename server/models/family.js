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
                    'INSERT INTO t_family_structure(family_id, name, type, face_id) VALUES(?, ?, ?, ?)',
                    [familyId, item.name, item.type, item.family_id],
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
                const insertFamilyResult = await this.insertFamily().catch(() => {
                    const error = new Error('post family insertId not found');
                    return reject(error);
                });
                if (!insertFamilyResult.insertId) {
                    this.connection.rollback();
                    const error = new Error('post family insertId not found');
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

    /**
     * 指定familyIdのtimestampを更新する。
     * @param familyId Number
     * @returns {Promise}
     */
    updateFamily(familyId) {
        return new Promise((resolve, reject) => {
            this.connection.query('UPDATE SET timestamp=NOW() WHERE id=?', [familyId], (queryError, results) => {
                if (queryError) {
                    return reject(queryError);
                }
                return resolve(results);
            });
        });
    }

    /**
     * timestampで最新のfamily情報を取得する。
     * @returns {Promise}
     */
    latestFamily() {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM m_family ORDER BY timestamp DESC LIMIT 1', (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    getFamilyList() {
        return new Promise(async (resolve, reject) => {
            const latestFamily = await this.latestFamily();
            this.connection.query(
                `SELECT
                 fs.id as id,
                 f.id as family_id,
                 fs.name as name,
                 fs.type as family_type
                  FROM m_family f
                  INNER JOIN t_family_structure fs
                  ON f.id = fs.family_id
                  WHERE f.id = ?`,
                [latestFamily[0].id],
                (queryErr, results) => {
                    if (queryErr) reject(queryErr);
                    resolve(results);
                },
            );
        });
    }
}
