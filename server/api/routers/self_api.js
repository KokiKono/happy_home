import express from 'express';
import jwt from 'jsonwebtoken';
import contollers from '../controllers';

const router = express.Router();

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

// ../server/models/dao系から値を取得する場合や非同期処理系はasync,awaitを使用する。
router.get('/sample', async (req, res) => {
    res.json({ message: 'hello sample', calc: await contollers.sample.select() });
});

export default router;
