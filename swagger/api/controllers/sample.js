/**
 * Created by kokikono on 2017/10/25.
 */
'use strict'

const createObj = (id, name, age) => {
    return {
        id,
        name,
        age,
    };
}
const sample = (req, res) => {
    let resObj = [];
    for (let i = 1; i < 20; i + 1) {
        resObj = [
            ...resObj,
            createObj(i, `name ${i}`, i * Math.random()),
        ];
    }
    res.json(resObj);
}

module.exports = {
    sample,
};
