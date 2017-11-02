import express from 'express';
import jwt from 'jsonwebtoken';
import SampleModel from '../../models/sample';
import FamilyModel from '../../models/family';
import NoticeNewModel from '../../models/notice_list_new';
import SuggestionModel from '../../models/suggestion';

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

router.get('/suggestion', (req, res, next) => {

    const createTaskList = (result) => {
        let resObj = [];
        for (let i = 0; i < result.results.length; i++) {
            resObj = [
                ...resObj,
                {
                    id: result.results[i].sd_id,
                    contents: result.results[i].task_contents,
                    is_done: i % 2 === 0,//test用
                },
            ];
        }
        return resObj;
    };

    const suggestionModel = new SuggestionModel();
    suggestionModel.selectSuggestionDetail(req.param('id'))
        .then((result) => {
            let resObj = [];
            for (let i = 0; i < result.results.length; i++) {
                resObj = [
                    {
                        id: result.results[0].suggestion_id,
                        title: result.results[0].title,
                        point: result.results[0].point,

                        family_structure : {
                            id: 'id',
                            family_id: req.user.family_id,
                            name: '家族名前',
                            type: 'おとうさん',
                        },
                        task_list: createTaskList(result),
                    },
                ];
            }
            res.json(resObj);
        })
        .catch((err) => {
            next(err);
        });
});


export default router;
