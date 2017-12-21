/**
 * Created by kokikono on 2017/11/25.
 */
import SuggestionModel from '../../models/suggestion';

const createJudgment = (label, val) => ({ label, val });
const judgments = [];
judgments.push(createJudgment('怒り', 'anger'));
judgments.push(createJudgment('軽蔑', 'contempt'));
judgments.push(createJudgment('嫌悪', 'disgust'));
judgments.push(createJudgment('恐れ', 'fear'));
judgments.push(createJudgment('幸福', 'happiness'));
judgments.push(createJudgment('中性', 'neutral'));
judgments.push(createJudgment('悲しみ', 'sadness'));
judgments.push(createJudgment('驚き', 'surprise'));

exports.index = async (req, res) => {
    const suggestionModel = new SuggestionModel();
    const { results } = await suggestionModel.selectAllSuggestion();
    res.render('management/suggestion/index', {
        suggestion_list: results,
    });
}

exports.judgment = async (req, res) => {
    const suggestionModel = new SuggestionModel();
    const { results } = await suggestionModel.selectJudgment(req.param('suggestion_id'));
    res.render('management/suggestion/judgment', {
        judgment_list: results,
        suggestion_id: req.param('suggestion_id'),
        judgment_trans_list: judgments,
    });
};
exports.postJudgment = async (req, res) => {
    const suggestionModel = new SuggestionModel();
    console.log(req.body.key_name)
    await suggestionModel.insertJudgment(req.param('suggestion_id'), req.body.key_name, req.body.val);
    res.redirect(req.originalUrl);
}

exports.judgmentKeyList = async (req, res) => {
    const suggestionModel = new SuggestionModel();
    const emotions = await suggestionModel.selectAllEmotion();
    const scoresList = [];
    emotions.results.forEach((item) => {
        const scores = JSON.parse(item.json_data);
        scoresList.push(scores[0].scores);
    });
    const modelScoreKey = [];
    scoresList.forEach((item) => {
        const itemKeys = Object.keys(item);
        itemKeys.forEach((key) => {
            if (modelScoreKey.indexOf(key) === -1) {
                modelScoreKey.push(key);
            }
        });
    });
    const diffKey = [];
    modelScoreKey.forEach((item) => {
        const find = judgments.find((ele) => {
            if (item === ele.val) {
                return item;
            }
            return false;
        });
        if (find === undefined) {
            diffKey.push(item);
        }
    });
    res.render('management/suggestion/judgment_key_list', {
        diffKey,
    });
}
