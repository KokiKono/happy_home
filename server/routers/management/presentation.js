/**
 * Created by kokikono on 2017/12/15.
 */
import express from 'express';

import presentationController from '../../contorller/management/presetantion';

const router = express.Router();

const isSetting = (req, res, next) => {
    res.cookie('id', res.path);
    next();
};

router.get('/', presentationController.indexParam);
router.get('/', presentationController.index);

const sceneRouter = express.Router();
sceneRouter.get('/', isSetting);
// sceneRouter.get('/*', isSetting);

sceneRouter.get('/', presentationController.scene);
sceneRouter.get('/choice', presentationController.choice);
sceneRouter.get('/out', presentationController.outScene);
sceneRouter.get('/family', presentationController.familyScene);
router.use('/scene', sceneRouter);

router.get('/emotion', presentationController.emotion);

const animationRouter = express.Router();
animationRouter.get('/start', presentationController.homeAnimation);
router.use('/animation', animationRouter);

router.get('/suggestion', presentationController.suggestionStart);

export default router;
