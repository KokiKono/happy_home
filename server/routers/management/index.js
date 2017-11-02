import express from 'express';
import ejs from 'ejs';
import * as path from 'path';

const router = express.Router();
router.get('/', (req, res) => {
    res.render('management/index', {
        title: 'タイトルです',
        content: 'ほげ',
        main: '<h1>hoge</h1>',
    });
});

router.get('/hoge', (req, res) => {
    ejs.renderFile(path.join(__dirname, '../../views/management/hoge.ejs'), { hoge: 'aho' }, null, (err, str) => {
        res.render('management/index', {
            title: 'タイトルです',
            content: 'ほげ',
            main: str,
        });
    });
})

router.get('/template', (req, res) => {
    res.render('management/index/')
})

export default router;
