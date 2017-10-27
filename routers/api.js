import express from 'express';
import corser from 'corser';
import logger from 'morgan';
import selfRouter from './self_api';
import mockRouter from './mock';

const router = express.Router();
router.use(logger());
router.use(corser.create());

const nodeEnv = process.env.NODE_ENV ? process.env.NODE_ENV : 'real';
if (nodeEnv === 'mock') {
    router.use('/', mockRouter);
} else {
    router.use('/', selfRouter);
}

// 404 message
router.use((req, res, next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
});

// error handling
router.use((err, req, res) => {
    res.json({
        message: err.message ? err.message : 'initial server error',
        status: err.status ? err.status : 500,
        ok: err.ok ? err.ok : false,
    });
});

export default router;
