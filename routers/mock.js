import express from 'express';
import contollers from '../server/api/controllers';

const router = express.Router();
router.get('/sample', (req, res) => {
    res.json({ message: 'hello sample', calc: 'hogehoge' });
});

export default router;
