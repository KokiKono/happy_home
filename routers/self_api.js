import  express from 'express';

const router = express.Router();

router.get('/hoge', (req, res) => {
    res.json({ message: 'hello hoge' });
});

export default router;
