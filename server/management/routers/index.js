import express from 'express';

const router = express.Router();
router.get('/', (req, res) => {
    res.render('index', {
        title: 'タイトルです',
        content: 'ほげ',
    });
});

export default router;
