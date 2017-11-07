import http from 'http';
import socketIo from 'socket.io';
import Watch from '../watch/index';

const ioEvent = function (io) {

    io.on('connection', (socket) => {
        socket.on('add date', (msg) => {
            io.emit('add date', msg);
        });

        io.on('change event logs', (log) => {
            console.log('うごいた');
            io.emit('change log', log);
        });


    });


};

const init = function (app) {

    const server = http.Server(app);
    const io = socketIo(server);
    const watch = new Watch(io);
    ioEvent(io);
    return server;

};
module.exports = init;
