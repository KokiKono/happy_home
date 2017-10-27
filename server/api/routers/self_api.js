import express from 'express';
import contollers from '../controllers';

const router = express.Router();
// ../server/models/dao系から値を取得する場合や非同期処理系はasync,awaitを使用する。
router.get('/sample', async (req, res) => {
    res.json({ message: 'hello sample', calc: await contollers.sample.select() });
});

export default router;
