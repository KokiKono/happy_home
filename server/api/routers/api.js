import express from 'express';
import corser from 'corser';
import logger from 'morgan';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import selfRouter from './self_api';
import mockRouter from './mock';

const router = express.Router();
router.use(logger());
router.use(corser.create());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/login', (req, res) => {
    // auth
    jwt.sign({
        user: {
            family_id: req.param('family_id'),
            family_structure_id: req.param('family_structure_id'),
        },
    }, 'secret', { algorithm: 'HS256' }, (err, token) => {
        if (err) {
            return res.sendStatus(403).send({
                message: 'ユーザー認証失敗',
                status: 403,
                ok: false,
            });
        }
        // ここで家族シーンと紐付け。
        return res.json({
            token,
            is_validity: true,
        });
    });
});

router.all('/*', (req, res, next) => {
    if (req.path === 'login') {
        next();
        return;
    }
   // check auth
    const token = req.body.token || req.query.token || req.get('Authorization');
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
           res.status(403).send({
               message: '権限なし',
               status: 403,
               ok: false,
           });
           return;
        }
        // ok
        req.user = decoded.user;
        // call user info , req.user
        next();
    });
});

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
