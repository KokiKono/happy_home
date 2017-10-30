/**
 * Created by kokikono on 2017/10/28.
 */
import express from 'express';
import jwt from 'jsonwebtoken';

const filter = express.Router();

const createNoSecurity = (path, method) => {
    const result = {
        path,
        method,
    };
    return result;
};

const noSecurityPathList = [
    createNoSecurity('/login', 'POST'),
    createNoSecurity('/family_list', 'GET'),
    createNoSecurity('/emotions', 'POST'),
    createNoSecurity('/family_list', 'POST'),
];

// filtering
filter.all('/*', (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
        return;
    }
    // no secure check
    if (req.originalUrl.match('/event')) {
        next();
        return;
    }
    let secure = true;
    noSecurityPathList.some((item) => {
        if (item.path === req.path && item.method === req.method) {
            secure = false;
            return true;
        }
        return false;
    });

    if (!secure) {
        // no secure
        next();
        return;
    }
    // check auth
    const token = req.body.token || req.query.token || req.get('Authorization');
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            const error = new Error('権限なし');
            error.status = 403;
            error.ok = false;
            next(error);
        } else {
            // ok
            req.user = decoded.user;
            // call user info , req.user
            next();
        }
    });
});


export default filter;
