/**
 * Created by kokikono on 2017/12/01.
 */
import FamilyModel from '../../models/family_list';
import configFile from '../../../config.json';
import * as fs from 'fs';
import * as path from 'path';

const config = configFile[process.env.NODE_ENV];

exports.index = (req, res) => {
    res.render('main/index');
}
exports.familyList = (req, res, next) => {
    const familyListModel = new FamilyModel();
    familyListModel.select()
        .then((result) => {
            console.log(result.results);
            const main = result.results.filter((element) => {
                try {
                    fs.statSync(path.join(__dirname, `../../views/public/images/${element.face_id}.jpg`));
                    return element;
                } catch (er) {
                    return false;
                }
            });
            console
                .warn(main);
            // TODO 画像がない場合はスルー

            res.render('main/family_list', {
                main,
                api_url: `http://${config.server.url}:${config.server.port}/api/family_list`,
            });
        })
        .catch((err) => {
            next(err);
        });
}

exports.scene = (req, res, next) => {
    res.render('main/scene_select', {
        api_url: `http://${config.server.url}:${config.server.port}/api/event/scenes`,
    });
}
