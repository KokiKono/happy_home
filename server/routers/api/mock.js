import express from 'express';
import jwt from 'jsonwebtoken';

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

router.get('/sample', (req, res) => {
    res.json({
        message: 'hello sample',
        calc: 'hogehoge',
        user: req.user,
    });
});

router.get('/notice_list/new', (req, res) => {
   let resObj = [];
   for (let i = 1; i < 20; i += 1) {
       resObj = [
           ...resObj,
           {
               id: i,
               family_structure_id: req.user.family_structure_id,
               title: 'タイトル',
               suggestion_id: i + 10,
           },
       ];
   }
   res.json(resObj);
});

router.get('/notice_list/new/:id', (req, res) => {
    const resObj = {
        id: req.param('id'),
        family_structure_id: req.user.family_structure_id,
        title: 'タイトル',
        notice_contents: '通知内容',
        suggestion_list: [
            {
                id: 1,
                title: 'タスクのタイトル',
            },
            {
                id: 1,
                title: 'タスクのタイトル',
            },
        ],
    };
    res.json(resObj);
});

router.get('/notice_list/old', (req, res) => {
    let resObj = [];
    for (let i = 1; i < 20; i += 1) {
        resObj = [
            ...resObj,
            {
                id: i,
                family_structure_id: req.user.family_structure_id,
                title: 'タイトル',
                suggestion_id: i + 10,
            },
        ];
    }
    res.json(resObj);
});

router.get('/notice_list/old/:id', (req, res) => {
    const resObj = {
        id: req.param('id'),
        family_structure_id: req.user.family_structure_id,
        title: '奥さんの機嫌をあなたさんの〇〇で解決されました。',
        result_contents: '行動結果内容',
        behavior_result: 'あなたの行動内容',
    };
    res.json(resObj);
});

const createTaskList = () => {
    let resObj = [];
    for (let i = 1; i < 11; i += 1) {
        resObj = [
            ...resObj,
            {
                id: i,
                contents: 'タスク内容',
                is_done: i % 2 === 0,
            },
        ];
    }
    return resObj;
};

router.get('/suggestion/:id', (req, res) => {
    const resObj = {
        id: req.param('id'),
        title: 'タイトル',
        point: parseInt(((Math.random() * 10) * (Math.random() * 10)), 10),
        family_structure: {
            id: parseInt((Math.random() * 10), 10),
            family_id: req.user.family_id,
            name: '家族名前',
            type: 'おとうさん',
        },
        task_list: createTaskList(),
    };
   res.json(resObj);
});

router.get('/points', (req, res) => {
    let resObj = [];
    for (let i = 1; i < 20; i += 1) {
        resObj = [
            ...resObj,
            {
                id: i,
                tag_icon: 'https://png.icons8.com/search',
                contents: 'ポイント稼ぎ内容',
                point: parseInt((Math.random() * 100), 10),
                family_icon: 'https://png.icons8.com/search',
            },
        ];
    }
    res.json(resObj);
});

router.get('/family_list', (req, res) => {
    let resObj = [];
    for (let i = 1; i < 20; i += 1) {
        resObj = [
            ...resObj,
            {
                id: parseInt((Math.random() * 10), 10),
                family_id: parseInt((Math.random() * 10), 10),
                name: '家族名前',
                type: 'おとうさん',
            },
        ];
    }
    res.json(resObj);
});

router.post('/event/emotions', (req, res) => {
    res.statusCode = 204;
    res.send();
});
router.post('/event/iot', (req, res) => {
    res.statusCode = 204;
    res.send();
});
router.post('/event/scenes', (req, res) => {
    res.statusCode = 204;
    res.send();
});
router.post('/event/animations', (req, res) => {
    res.statusCode = 204;
    res.send();
});

export default router;
