/**
 * ブラウザカメラ起動用
 * Created by I.Asakawa on 2018/01/03.
 */

import * as path from 'path';
import * as fs from 'fs';
import Async from 'async';
import momentTimezone from 'moment-timezone';
import moment from 'moment';
import CreateFamilyPreparation from './createFamilyPreparation';
require('waitjs');

export default class brawserCamera {

    constructor() {
        this.SCOPE_DIR = './views/public/images/';
        const nowTime = momentTimezone().tz('Asia/Tokyo').format();
        this.now = moment(nowTime);
    }

    fileStatus(filePath) { // eslint-disable-line
        return new Promise((resolve, reject) => {
            fs.stat(filePath, (err, stats) => {
                if (err) reject(err);
                resolve(stats);
            });
        });
    }

    async watchDir() {
        return new Promise((resolve, reject) => {
            repeat('2 secs', () => {
                fs.readdir(this.SCOPE_DIR, (err, files) => {
                    if (err) reject(err);
                    let fileList = []; // eslint-disable-line
                    Async.each(files, async (file) => {
                        // 画像ファイルのみ
                        if (!/.*\.jpg$/.test(file)) { return; }
                        const status = await this.fileStatus(`${this.SCOPE_DIR}${file}`).catch((err2) => { reject(err2); });
                        const atime = moment(status.atime);
                        const diffSec = atime.diff(this.now.format(), 'milliseconds');
                        if (diffSec > 0) {
                            fileList.push(`${this.SCOPE_DIR}${file}`);
                        }
                        if (fileList.length >= 10) {
                            clear('watch_dir')
                            return resolve('success');
                        }
                    }, (err3) => {
                        if (err3) reject(err3);
                    });
                })
            }, 'watch_dir')
        })
    }

    start(app){
        return new Promise(async (resolve, reject) => {

            process.on('unhandledRejection', console.dir);

            //メイン画面の切り替え
            // app.socket.io.emit('url', 'http://' + location.hostname + ':8080/brawser_camera/index.html');

            await this.watchDir().then(async function(result) {
                const createFamilyPreparation = new CreateFamilyPreparation(10, path.join(__dirname, '../../views/public/images/'));
                result = await createFamilyPreparation.start().catch(err => console.log(err));

                resolve(result);
            }).catch(function (error) {
              console.log('err '+error);
            });
        })
    }
}