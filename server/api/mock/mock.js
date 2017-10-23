exports.sample = function (req, res) {
    var user = {};
    user.username = req.param('username');
    user.password = req.param('password');
    res.json(user);
}

exports.newNoticeList = (req, res) => {
    const list = [
        {
            id: 1,
            family_structure_id: req.param('family_structure_id'),
            title: '通知タイトル1',
            suggestion_id: null,
        },
        {
            id: 2,
            family_structure_id: req.param('family_structure_id'),
            title: '通知タイトル2',
            suggestion_id: 1,
        },
        {
            id: 3,
            family_structure_id: req.param('family_structure_id'),
            title: '通知タイトル3',
            suggestion_id: null,
        },
    ];
    res.json(list);
}

exports.newNoticeDetail = (req, res) => {
    const resObj = {
        id: req,
        family_structure_id: 1,
        title: '通知タイトル',
        notice_contents: '奥さんの機嫌が悪いです。¥n家族円満に協力してください。',
        suggestion_id: null,
        suggestion_list: [
            {
                id: 1,
                contents: '提案タイトル1',
            },
            {
                id: 2,
                contents: '提案タイトル2',
            },
            {
                id: 3,
                contents: '提案タイトル3',
            },
        ],
    };
    res.json(resObj);
}

exports.suggestionDetail = (req, res) => {
    const resObj = {
        id: req,
        title: '提案タイトルをして奥さんに元気になってもらいましょう。¥nこの行動で、奥さんの幸せパラメーターは10上がります。',
        point: 10,
        family_structure: {
            id: 1,
            family_id: 1,
            name: '奥さん名前',
            type: '妻',
        },
        task_list: [
            {
                id: 1,
                contents: 'タスク内容1',
                is_done: false,
            },
            {
                id: 2,
                contents: 'タスク内容2',
                is_done: false,
            },
            {
                id: 3,
                contents: 'タスク内容3',
                is_done: false,
            },
        ],
    };
    res.json(resObj);
}