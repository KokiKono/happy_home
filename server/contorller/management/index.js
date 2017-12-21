/**
 * Created by kokikono on 2017/11/25.
 */

const createLink = (label, href) => ({ label, href });
const links = [];
links.push(createLink('ホーム', './'))
links.push(createLink('提案判断登録', './suggestion/'));
links.push(createLink('感情キー未登録一覧', './suggestion/judgment_key_list'));
links.push(createLink('プレゼンテーション管理', './presentation/'));
links.push(createLink('単体起動管理', './presentation/chips'));

exports.index = (req, res) => {
    res.render('management/index', {
        links,
    });
};
