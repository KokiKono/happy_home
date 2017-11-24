import express from 'express';
import FamilyListModel from '../../models/family_list';

const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

router.get('/', (req, res) => {
    const familyListModel = new FamilyListModel();
    familyListModel.select()
        .then((result) => {
            console.log(result.results);
            res.render('main/family_list', {
                main: result.results
            });
        })
        .catch((err) => {
            next(err);
        })
});

router.post('/', (req, res) => {
    console.log(req.body);
    var i = 0;
    var family_list = [];
    
    req.body.face_id.forEach((value, key) => {
        var family = {face_id : req.body.face_id[i], type : req.body.type[i], name : req.body.name[i]};
        family_list.push(family)
        i++;
    });
    console.log(family_list);
    console.log(JSON.stringify(family_list));

    const familyListModel = new FamilyListModel();
    familyListModel.select()
        .then((result) => {
            console.log(result.results);
            res.render('main/family_list', {
                main: result.results
            });
        })
        .catch((err) => {
            next(err);
        })
});

export default router;