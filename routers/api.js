import express from 'express';
import logger from 'morgan';
import selfRouter from './self_api';

const router = express.Router();
router.use(logger());

router.use('/', selfRouter);

// 404 message
router.use((req, res, next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
});

// error handling
router.use((err, req, res, next) => {
    res.json({
        message: err.message ? err.message : 'initial server error',
        status: err.status ? err.status : 500,
        ok: err.ok ? err.ok : false,
    });
})

export default router;
