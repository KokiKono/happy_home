import express from 'express';
import jwt from 'jsonwebtoken';
import Async from 'async';
import expressFileUplpad from 'express-fileupload';
import * as path from 'path';
import SampleModel from '../../models/sample';
import FamilyModel from '../../models/family';
import NoticeNewModel from '../../models/notice_list_new';
import SuggestionModel from '../../models/suggestion';
import NoticeOldModel from '../../models/notice_list_old';
import PointsModel from '../../models/points';
import SceneModel from '../../models/scene';
import AnimationModel from '../../models/animations';
import LoveNumberModel from '../../models/loveNumber';

const router = express.Router();
router.use(expressFileUplpad());

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
    const noticeNewModel = new NoticeNewModel(req.user.family_id, req.user.family_structure_id);
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
                        title: result[i].title,
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

router.get('/suggestion/:id', async (req, res, next) => {
    const suggestionModel = new SuggestionModel();
    suggestionModel.selectSuggestion(req.param('id'))
    .then(async (result) => {
        const isReceiving = await suggestionModel.isReceiving(req.param('notice_id'), req.param('id'))
            .catch(err => console.error(err));
        const resObj = {
            id: result.results[0].id,
            is_receiving: isReceiving,
            title: result.results[0].title,
            point: result.results[0].point,
            family_structure: await getFamilyStructure(
                req.user.family_structure_id,
                req.user.family_id,
            ),
            task_list: await createTaskList(req.param('id'), req.param('notice_id')),
        };
       res.json(resObj);
    })
   .catch((err) => {
       next(err);
   });
});

router.post('/suggestion/:id', async (req, res, next) => {
    const suggestionModel = new SuggestionModel();
    const noticeSuggestion = await suggestionModel.selectNoticeSuggestion(
        req.param('notice_id'),
        req.param('id'),
    ).catch(err => next(err));
    if (noticeSuggestion.length === 0) {
        const notFound = new Error('not found notice_suggestion');
        notFound.status = 404;
        next(notFound);
        return;
    }
    suggestionModel.updateReceiving(noticeSuggestion[0].id, req.body.post_suggestion.is_receiving)
        .then(() => {
            res.sendStatus(204);
        })
        .catch(err => next(err));
});

router.get('/suggestion_now', (req, res, next) => {
    const suggestionModel = new SuggestionModel();
    suggestionModel.nowSuggestions(req.user.family_structure_id)
        .then(success => res.json(success.results))
        .catch(err => next(err));
});

router.get('/notice_list/new/:id', (req, res, next) => {
    const noticeNewModel = new NoticeNewModel(req.user.family_id, req.user.family_structure_id);
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
router.put('/notice_list/new/:id', (req, res, next) => {
    const noticeNewModel = new NoticeNewModel(req.user.family_id, req.user.family_structure_id);
    console.log('skip---------')
    console.info(req.body);
    noticeNewModel.updateSkip(
        req.param('id'),
        req.body.body.is_skip,
    )
        .then(() => res.sendStatus(204))
        .catch(err => next(err));
});

router.put('/notice_list/:id/:suggestionId/:suggestionDetailId', async (req, res) => {
    const noticeId = req.param('id');
    console.info(req.params);
    // console.info(req.body.is_done)
    const suggestionId = req.param('suggestionId');
    const suggestionDetailId = req.param('suggestionDetailId');

    const noticeNewModel = new NoticeNewModel();
    const noticeNew = await noticeNewModel.selectAtId(noticeId);
    if (noticeNew.results.length === 0) {
        res.sendStatus(404)
        return;
    }
    const suggestionModel = new SuggestionModel();
    const isReceiving = await suggestionModel.isReceiving(noticeId, suggestionId);
    if (!isReceiving) {
        res.sendStatus(409);
        return;
    }
    suggestionModel.toggleSuggestionTask(suggestionDetailId, noticeId, req.body.body.is_done)
        .then(() => res.sendStatus(204))
        .catch((err) => {
            res.status(500);
            res.json(err);
        });

    suggestion.selectSuggestionDone(noticeId)
        .then((result) => {
            let flg = true;
            for (let i = 0; i < result.results.length; i++) {
                if(result.results[i].done != true){
                    flg = false;
                }
            }

            if(flg === true){
                for (let i = 0; i < result.results.length; i++) {
                    suggestion.insertLovePoint(result.results[i].family_structure_id, result.results[i].point, noticeId)
                }
            }

    })

});

router.get('/notice_list/old', (req, res, next) => {
    const noticeOldModel = new NoticeOldModel(req.user.family_id, req.user.family_structure_id);
    noticeOldModel.select()
        .then((result) => {
            res.json(result.results);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/notice_list/old/:id', (req, res, next) => {
    const noticeOldModel = new NoticeOldModel(req.user.family_id, req.user.family_structure_id);
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

router.get('/points', async (req, res, next) => {
    const pointsModel = new PointsModel();
    const { results } = await pointsModel.select().catch(err => next(err));
    const pointList = [];
    const suggestionModel = new SuggestionModel();
    await Async.each(results, async (point, callback) => {
        const taskList = await suggestionModel.selectSuggestionDetails(point.id);
        pointList.push(Object.assign(point, { task_list: taskList.results }));
        callback();
    }, () => {
        res.json(pointList);
    });
});

router.post('/points/:id', (req, res, next) => {
    console.log(req.param('id'));
    const pointsModel = new PointsModel();
    pointsModel.receivingPoint(req.user.family_structure_id, Number(req.param('id')))
        .then((result) => {
            res.json(result);
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

router.get('/awards', async (req, res, next) => {
    const loveNumberModel = new LoveNumberModel();
    const loveNumber = await loveNumberModel.getAwards()
        .catch(err => next(err));
    // loginユーザー情報取得
    let loginUser = loveNumber.results
        .find(element => element.id === req.user.family_structure_id);
    if (loginUser === undefined) {
        // ランキングに乗ってない場合
        const familyModel = new FamilyModel();
        const { results } = await familyModel.getFamilyStructure(
            req.user.family_id,
            req.user.family_structure_id,
        ).catch(err => next(err));
        loginUser = results;
    }
    // console.log(loginUser)
    const resObj = {
        login_user: {
            id: loginUser[0].id,
            user_name: loginUser[0].name,
            point: loginUser[0].point ? loginUser[0].point : 0,
            ranking: loginUser[0].award ? loginUser[0].award : 0,
            icon_url: loginUser[0].family_icon,
        },
        award_list: [],
    };

    Promise.all(loveNumber.results.map((item, index) => {
        if (item.id === loginUser.id) return null;
        return resObj.award_list.push(Object.assign({ ranking: index + 1 }, item));
    }));

    res.json(resObj);

});

router.post('/image/upload', (req, res) => {
    if (!req.files) return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const imageFile = req.files.image;

    const timestamp = Date.now().toString();
    // Use the mv() method to place the file somewhere on your server
    return imageFile.mv(`${path.join(__dirname, '../../views/public/images/')}${timestamp}.jpg`, (err) => {
        if (err) return res.status(500).send(err);
        return res.sendStatus(200);
    });
});

export default router;
