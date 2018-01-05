/**
 * ブラウザカメラ(感情取得)起動用
 * Created by I.Asakawa on 2018/01/03.
 */

import * as path from 'path';
import * as fs from 'fs';
import Async from 'async';
import momentTimezone from 'moment-timezone';
import moment from 'moment';
import Emotion from './emotion';
import configFile from '../../../config.json';

require('waitjs');

export default class emotionCamera {

    constructor() {
        this.SCOPE_DIR = './views/public/images/';
        const nowTime = momentTimezone().tz('Asia/Tokyo').format();
        this.now = moment(nowTime);
        this.config = configFile[process.env.NODE_ENV];
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
                        if (fileList.length >= 5) {
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

            //メイン画面の切り替え
            app.socket.io.emit('url', 'http://' + this.config.server.url + ':8080/brawser_camera/emotion_camera.html');

            const beginTime = this.now;
            this.watchDir().then(async (result) => {
                console.warn('感情読み取り前！！！！！！！！！！！')
                const emotion = new Emotion(10, path.join(__dirname, '../views/public/images/'))
                result = await emotion.start().catch((err) => {
                    console.log('emotion err!!!!!!!1');
                    console.log(err);
                    throw err;
                });

                return resolve(result);
            }).catch((error) => {
              console.log('err ' + error);
              return reject(error);
            });
        });
    }
}
