import express from 'express';
import jwt from 'jsonwebtoken';
import SampleModel from '../../models/sample';
import FamilyModel from '../../models/family';
import NoticeNewModel from '../../models/notice_list_new';
import SuggestionModel from '../../models/suggestion';
import NoticeOldModel from '../../models/notice_list_old';
import PointsModel from '../../models/points';
import SceneModel from '../../models/scene';
import AnimationModel from '../../models/animations';

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
    familyModel.getFamilyList()
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

function createTaskList(id, notice_id) {
    const suggestionModel = new SuggestionModel();
    let resObj = [];
    return new Promise((resolve, reject) => {
        suggestionModel.selectSuggestionTask(id, notice_id).
        then((result) => {
            for (let i = 0; i < result.length; i += 1) {
                resObj = [
                    ...resObj,
                    {
                        id: result[i].id,
                        contents: result[i].task_contents,
                        is_done: result[i].done % 2 === 1,
                    },
                ];
            }
            resolve(resObj);
        })
        .catch((err) => (reject(err)));
    })
};

function getFamilyStructure(family_structure_id, fam_id){
    const suggestionModel = new SuggestionModel();
    return new Promise((resolve, reject) => {
        suggestionModel.selectFamilyStructure(family_structure_id, fam_id)
        .then((result) => {
            const resObj =
                {
                    id: family_structure_id,
                    family_id: fam_id,
                    name: result[0].name,
                    type: result[0].type,
                };
            resolve(resObj);
        })
        .catch((err) => (reject(err)));
    })
};

router.get('/suggestion/:id', (req, res, next) => {
    const suggestionModel = new SuggestionModel();
    suggestionModel.selectSuggestion(req.param('id'))
    .then(async (result) => {
        const resObj = {

            id: result.results[0].id,
            title: result.results[0].title,
            point: result.results[0].point,

            family_structure: await getFamilyStructure(req.user.family_structure_id, req.user.family_id),

            task_list: await createTaskList(req.param('id'), req.param('notice_id')),
        };
       res.json(resObj);
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

router.put('/notice_list/new/:id/:suggestionId/:suggestionDetailId', async (req, res) => {
    const noticeId = req.param('id');
    const suggestionId = req.param('suggestionId');
    const suggestionDetailId = req.param('suggestionDetailId');

    const noticeNewModel = new NoticeNewModel();
    const noticeNew = await noticeNewModel.selectAtId(noticeId);
    if (noticeNew.results.length === 0) {
        res.sendStatus(404)
        return;
    }
    const suggestionModel = new SuggestionModel();
    const isReceiving = await suggestionModel.isReciving(noticeId, suggestionId);
    if (!isReceiving) {
        res.sendStatus(409);
        return;
    }
    const suggestionDetail = await suggestionModel.selectSuggestionDetail(suggestionDetailId);
    if (suggestionDetail.results.length === 0) {
        res.sendStatus(404);
        return;
    }
    suggestionModel.toggleSuggestionTask(suggestionDetailId, noticeId)
        .then(() => res.sendStatus(204))
        .catch((err) => {
            res.status(500);
            res.json(err);
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

router.get('/points', (req, res, next) => {
    const pointsModel = new PointsModel();
    pointsModel.select()
        .then((result) => {
            res.json(result.results);
        })
        .catch((err) => {
            next(err);
        });
});

router.post('/event/scenes', async (req, res) => {
    const familyModel = new FamilyModel();
    const latestFamily = await familyModel.latestFamily();
    const sceneModel = new SceneModel();
    sceneModel.insertScene(latestFamily[0].id, req.body.type)
        .then(() => {
            res.status(204);
            res.send();
        })
        .catch((err) => {
            res.status(500);
            res.json(err);
        });
});

router.post('/event/animations', async (req, res) => {
    const animationModel = new AnimationModel();
    animationModel.updateAnimation(req.body.type)
        .then(() => {
            res.status(204);
            res.send();
        })
        .catch((err) => {
            res.status(500);
            res.json(err);
        });
});

export default router;
