const Socket = function (io) {
  io.on('connection', (socket) => {
    // クライアントから受け取ったメッセージをサーバーで処理するようイベントを登録
    // （c2s→client to server | s2c→server to client）
    socket.on('add', (val) => {
      io.emit('add', val);
      console.log('動いたよ');
    });
  });
};
module.exports = Socket;
