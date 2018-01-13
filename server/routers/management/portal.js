/**
 * Created by kokikono on 2017/12/15.
 */
import express from 'express';
import expressFileUplpad from 'express-fileupload';

import portalController from '../../contorller/management/portal';

const router = express.Router();

const isSetting = (req, res, next) => {
    res.cookie('id', res.path);
    next();
};

// router.use(portalController.routingHistory);
router.get('/', portalController.indexParam);
router.get('/', portalController.index);
router.get('/root', portalController.root);
router.post('/create_family', portalController.postCreateFamily);
const sceneRouter = express.Router();
sceneRouter.get('/', isSetting);
// sceneRouter.get('/*', isSetting);

sceneRouter.get('/', portalController.scene);
sceneRouter.get('/choice', portalController.choice);
sceneRouter.post('/choice', portalController.postChoice);
sceneRouter.get('/out', portalController.outScene);
sceneRouter.get('/family', portalController.familyScene);
router.use('/scene', sceneRouter);

router.get('/emotion', portalController.emotion);

const animationRouter = express.Router();
animationRouter.get('/start', portalController.homeAnimation);
animationRouter.get('/mobile', portalController.mobileAnimation);
animationRouter.get('/home_comeback', portalController.homeComebackAnimation);
animationRouter.get('/dinner', portalController.dinner);
animationRouter.get('/out/comeback', portalController.outHomeComeback);
animationRouter.get('/out/dinner', portalController.outDinner);
router.use('/animation', animationRouter);

router.get('/hoge', (req, res) => {
    req.socket.io.emit('url', 'http://172.20.10.2:8080/animation/emotion_scaning_finish/index.html');
    res.sendStatus(200)
})

router.get('/create_family_presentation', portalController.createFamilyPresentation);
router.post('/post_create_family', expressFileUplpad());
router.post('/post_create_family', (req, res, next) => {
    portalController.updateBeginTime();
    portalController.postUpload(req, res, next);
});
router.get('/post_create_family_presentation', portalController.postCreateFamilyPresentation);

router.get('/emotion_start', portalController.emotionStart);
router.post('/post_emotion_start', expressFileUplpad());
router.post('/post_emotion_start', (req, res, next) => {
    portalController.updateBeginTime();
    portalController.postUpload(req, res, next);
});
router.get('/post_emotion', portalController.postEmotion);

router.get('/suggestion', portalController.suggestionStart);

export default router;
