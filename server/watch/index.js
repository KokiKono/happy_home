import chokidar from 'chokidar';
import fs from 'fs';
import * as jsdiff from 'diff';

let eventText = '';
let motionText = '';

const watchEvent = function (watcher, io) {
    // イベント定義
    watcher.on('ready', () => {
        // 準備完了
        console.log('ready watching');

        // ファイルの追加
        watcher.on('add', (path) => {
            console.log(`${path}added.`);
        });

        // ファイルの編集
        watcher.on('change', (path, stats) => {
            console.log(`./${path}`);
            fs.readFile(`./${path}`, 'utf-8', (err, text) => {
                let sabun = '';
                let okikae = '';
               switch (path) {
                   case 'tmp/event.log':
                       sabun = jsdiff.diffChars(eventText, text);
                       if (sabun.length != 1) {
                           okikae = sabun[1].value.replace('/\r\n|\r|\n/g', '');
                       } else {
                           okikae = sabun[0].value;
                       }
                       io.emit('change event logs', okikae);
                       eventText = text;
                       break;
                   case 'tmp/motion.log':
                       sabun = jsdiff.diffChars(motionText, text);
                       if (sabun.length != 1) {
                           okikae = sabun[1].value.replace('/\r\n|\r|\n/g', '');
                       } else {
                           okikae = sabun[0].value;
                       }
                       io.emit('change motion logs', okikae);
                       motionText = text;
                       break;
                   default:
                       break;
               }
            });
        });
    });
};


const init = function (io) {
    const watcher = chokidar.watch('.', {
        ignored: /[\/\\]\./,
        persistent: true,
    });
    fs.readFile('./tmp/event.log', 'utf-8', (err, text) => {
        eventText = text;
    });
    fs.readFile('./tmp/motion.log', 'utf-8', (err, text) => {
        motionText = text;
    });
    watchEvent(watcher, io);

};

module.exports = init;
