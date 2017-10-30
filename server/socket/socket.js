var Socket = function(io){
  io.on('connection', function(socket) {
    // クライアントから受け取ったメッセージをサーバーで処理するようイベントを登録
    // （c2s→client to server | s2c→server to client）
    socket.on('add', function(val) {
      io.emit('add', val);
      console.log('動いたよ');
    });
  });
}
module.exports = Socket;
