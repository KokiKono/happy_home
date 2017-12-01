/**
 * Created by kokikono on 2017/12/01.
 */
import express from 'express';
import mainController from '../../contorller/main';

const router = express.Router();
router.get('/', mainController.index);
router.get('/family_list', mainController.familyList);
router.get('/select_scene', mainController.scene);

export default router;
