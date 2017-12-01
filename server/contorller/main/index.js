/**
 * Created by kokikono on 2017/12/01.
 */
import FamilyModel from '../../models/family_list';

exports.index = (req, res) => {
    res.render('main/index');
}
exports.familyList = (req, res, next) => {
    const familyListModel = new FamilyModel();
    familyListModel.select()
        .then((result) => {
            console.log(result.results);
            res.render('main/family_list', {
                main: result.results
            });
        })
        .catch((err) => {
            next(err);
        });
}

exports.scene = (req, res, next) => {
    res.render('main/scene_select');
}
