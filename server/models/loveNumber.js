/**
 * Created by kokikono on 2017/12/01.
 */
import Dao from './dao';

export default class LoveNumberModel extends Dao {

    getAwards() {
        return super.query(
            `SELECT
                t_family_structure.id as id,
                SUM(t_love_number.point) as award,
                t_family_structure.name,
                t_family_structure.family_icon
            FROM t_love_number
            INNER JOIN t_family_structure
            ON t_family_structure.id = t_love_number.family_structure_id
            GROUP BY t_love_number.family_structure_id ORDER BY award DESC`,
        );
    }
}