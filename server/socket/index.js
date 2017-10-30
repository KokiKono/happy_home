const ioEvent = function (io) {

  io.on('connection', (socket) => {
      socket.on('chat message', (msg) => {
          io.emit('chat message', msg);
      });
  });
};

const init = function (app) {

  const server = require('http').Server(app);

  const io = require('socket.io')(server);

  ioEvent(io);
  return server;

};
module.exports = init;
