import express from 'express';
import indexController from '../../contorller/management/index';

import suggestionRouter from '../../routers/management/suggestion';
import presentationRouter from '../../routers/management/presentation';
import portalRouter from '../../routers/management/portal';

const router = express.Router();
router.get('/', indexController.index);

router.use('/suggestion', suggestionRouter);
router.use('/presentation', presentationRouter);
router.use('/portal', portalRouter);

export default router;
