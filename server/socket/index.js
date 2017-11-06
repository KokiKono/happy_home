import http from 'http';
import socketIo from 'socket.io';

const ioEvent = function (io) {

    io.on('connection', (socket) => {
        socket.on('add date', (msg) => {
            io.emit('add date', msg);
        });

        io.on('change logs', (log) => {
           io.emit('change log', log);
        });
    });


};

const init = function (app) {

    const server = http.Server(app);

    const io = socketIo(server);

    ioEvent(io);
    return server;

};
module.exports = init;
