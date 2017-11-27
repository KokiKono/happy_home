import express from 'express';
import indexController from '../../contorller/management/index';

import suggestionRouter from '../../routers/management/suggestion';

const router = express.Router();
router.get('/', indexController.index);

router.use('/suggestion', suggestionRouter);

export default router;
