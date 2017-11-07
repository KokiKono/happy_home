import express from 'express';
import jwt from 'jsonwebtoken';
import SampleModel from '../../models/sample';
import FamilyModel from '../../models/family';
import NoticeNewModel from '../../models/notice_list_new';
import NoticeOldModel from '../../models/notice_list_old';

const router = express.Router();

router.post('/login', (req, res) => {
    // auth
    jwt.sign({
        user: {
            family_id: req.param('family_id'),
            family_structure_id: req.param('family_structure_id'),
        },
    }, 'secret', { algorithm: 'HS256' }, (err, token) => {
        if (err) {
            return res.sendStatus(403).send({
                message: 'ユーザー認証失敗',
                status: 403,
                ok: false,
            });
        }
        // ここで家族シーンと紐付け。
        return res.json({
            token,
            is_validity: true,
        });
    });
});

router.get('/sample', (req, res, next) => {
    const sampleModel = new SampleModel();
    sampleModel.select()
        .then((result) => {
            res.json(result.results);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/family_list', (req, res, next) => {
    const familyModel = new FamilyModel();
    familyModel.latestFamily()
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/family_list', (req, res, next) => {
    const familyModel = new FamilyModel();
    familyModel.postFamily(req.body)
        .then((result) => {
           res.json({ message: 'ok', result });
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/notice_list/new', (req, res, next) => {
    const noticeNewModel = new NoticeNewModel();
    noticeNewModel.select()
        .then((result) => {
            res.json(result.results);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/notice_list/new/:id', (req, res, next) => {
    const noticeNewModel = new NoticeNewModel();
    noticeNewModel.selectAtId(req.param('id'))
        .then((result) => {
            let suggestion_list = [];
            for (let i = 0; i < result.results.length; i++) {
                suggestion_list = [
                    ...suggestion_list,
                    {
                        id: result.results[i].suggestion_id,
                        title: result.results[i].suggestion_title
                    },    
                ];
            }
            let resObj = {
                id: result.results[0].id,
                family_structure_id: result.results[0].family_structure_id,
                title: result.results[0].title,
                notice_contents: result.results[0].notice_contents,
                result_contents: result.results[0].result_contents,
                suggestion_list
            };
        res.json(resObj);
    })
    .catch((err) => {
        next(err);
    });
});

router.get('/notice_list/old', (req, res, next) => {
    const noticeOldModel = new NoticeOldModel();
    noticeOldModel.select()
        .then((result) => {
            res.json(result.results);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/notice_list/old/:id', (req, res, next) => {
    const noticeOldModel = new NoticeOldModel();
    noticeOldModel.selectAtId(req.param('id'))
        .then((result) => {
            let suggestion_list = [];
            for (let i = 0; i < result.results.length; i++) {
                suggestion_list = [
                    ...suggestion_list,
                    {
                        id: result.results[i].suggestion_id,
                        title: result.results[i].suggestion_title
                    },    
                ];
            }
            let resObj = {
                id: result.results[0].id,
                family_structure_id: result.results[0].family_structure_id,
                title: result.results[0].title,
                notice_contents: result.results[0].notice_contents,
                result_contents: result.results[0].result_contents,
                suggestion_list
            };
        res.json(resObj);
    })
    .catch((err) => {
        next(err);
    });
});

export default router;
