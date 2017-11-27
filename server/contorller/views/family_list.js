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

export default router;