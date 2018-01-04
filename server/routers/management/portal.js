/**
 * Created by kokikono on 2017/12/15.
 */
import express from 'express';

import portalController from '../../contorller/management/portal';

const router = express.Router();

const isSetting = (req, res, next) => {
    res.cookie('id', res.path);
    next();
};

router.get('/', portalController.indexParam);
router.get('/', portalController.index);
router.get('/root', portalController.root);
const sceneRouter = express.Router();
sceneRouter.get('/', isSetting);
// sceneRouter.get('/*', isSetting);

sceneRouter.get('/', portalController.scene);
sceneRouter.get('/choice', portalController.choice);
sceneRouter.get('/out', portalController.outScene);
sceneRouter.get('/family', portalController.familyScene);
router.use('/scene', sceneRouter);

router.get('/emotion', portalController.emotion);

const animationRouter = express.Router();
animationRouter.get('/start', portalController.homeAnimation);
animationRouter.get('/mobile', portalController.mobileAnimation);
animationRouter.get('/home_comeback', portalController.homeComebackAnimation);
animationRouter.get('/dinner', portalController.dinner);
router.use('/animation', animationRouter);

router.get('/suggestion', portalController.suggestionStart);

export default router;
