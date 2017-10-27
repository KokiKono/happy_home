import express from 'express';

const router = express.Router();
router.get('/sample', (req, res) => {
    res.json({ message: 'hello sample', calc: 'hogehoge' });
});

router.post('/emotions', (req, res) => {
    res.statusCode = 204;
    res.send();
});

router.get('/notice_list/new', (req, res) => {
   let resObj = [];
   for (let i = 1; i < 20; i += 1) {
       resObj = [
           ...resObj,
           {
               id: i,
               family_structure_id: i + 5,
               title: 'タイトル',
               suggestion_id: i + 10,
           },
       ];
   }
   res.json(resObj);
});

router.get('/notice_list/new/:id', (req, res) => {
    let resObj = [];
    for (let i = 1; i < 20; i += 1) {
        resObj = [
            ...resObj,
            {
                id: req.param('id'),
                family_structure_id: 1,
                title: 'タイトル',
                notice_contents: '通知内容',
                suggestion_list: {
                    id: i + 1,
                    title: 'タスクのタイトル',
                },
            },
        ];
    }
    res.json(resObj);
});

export default router;
