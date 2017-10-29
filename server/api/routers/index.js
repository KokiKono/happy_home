import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import filterRouter from './filter';
import selfRouter from './self_api';
import mockRouter from './mock';

const router = express.Router();
router.use(logger());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(filterRouter);

const nodeEnv = process.env.NODE_ENV ? process.env.NODE_ENV : 'real';
if (nodeEnv === 'mock') {
    router.use('/', mockRouter);
} else {
    router.use('/', selfRouter);
}

// 404 message
router.use((reqF, resF, nextF) => {
    const error = new Error('not found');
    error.status = 404;
    nextF(error);
});

// error handling
router.use('/', (err, req, res, next) => { // eslint-disable-line
    res.statusCode = err.status ? err.status : 500;
    res.json({
        message: err.message ? err.message : 'initial server error',
        status: err.status ? err.status : 500,
        ok: err.ok ? err.ok : false,
    });
});

export default router;
