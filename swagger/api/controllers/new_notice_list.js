const get = (req, res) => {
    res.json([
        {
            id: 1,
            family_structure_id: 1,
            title: 'hoge',
            suggestion_id: 1,
        },
        {
            id: 1,
            family_structure_id: 1,
            title: 'hoge',
            suggestion_id: 1,
        },
    ]);
}

module.exports = {
    getNewNoticeList: get,
};
