/**
 * Created by kokikono on 2017/10/28.
 */
import express from 'express';
import jwt from 'jsonwebtoken';

const filter = express.Router();

const noSecurityPathList = ['/login', '/family_list', '/emotions'];

// filtering
filter.all('/*', (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
        return;
    }
    // no secure
    if (noSecurityPathList.indexOf(req.path) >= 0) {
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
