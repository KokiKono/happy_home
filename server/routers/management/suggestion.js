/**
 * Created by kokikono on 2017/11/25.
 */
import express from 'express';
import * as bodyParser from 'body-parser';

import suggestionController from '../../contorller/management/suggestion';

const router = express.Router();
// router.use('/*', bodyParser.urlencoded({ extends: true }));
// router.use('/*', bodyParser.json());
router.get('/', suggestionController.index)
router.get('/judgment', suggestionController.judgment);
router.post('/judgment', suggestionController.postJudgment);
router.get('/judgment_key_list', suggestionController.judgmentKeyList);

export default router;
