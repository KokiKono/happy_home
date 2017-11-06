import chokidar from 'chokidar';

const watchEvent = function (watcher) {
    // イベント定義
    watcher.on('ready', () => {
        // 準備完了
        console.log('ready watching');

        // ファイルの追加
        watcher.on('add', (path) => {
            console.log(`${path} added.`);
        });

        // ファイルの編集
        watcher.on('change', (path, stats) => {
            console.log(`${path} changed.`);
            console.log(stats.size());
        });
    });
};


const init = function () {
    const watcher = chokidar.watch('.', {
        ignored: /[\/\\]\./,
        persistent: true,
    });
    console.log('動いた');

    watchEvent(watcher);
    // chokidar.watch('.', { ignored: /[\/\\]\./ }).on('all', (event, path) => {
    //     console.log(event, path);
    // });
};

module.exports = init;
