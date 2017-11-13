import http from 'http';
import socketIo from 'socket.io';
import Watch from '../watch/index';

const ioEvent = function (io) {

    io.on('connection', (socket) => {
        socket.on('add date', (msg) => {
            io.emit('add date', msg);
        });

        socket.on('change event logs', (log) => {
            console.log('うごいた');
            io.emit('change log', log);
        });

        setInterval(() => {
            const rand = Math.floor(Math.random() * 101);
            io.emit('graph update', rand);
        }, 5000);

    });


};

const init = function (app) {

    const server = http.Server(app);
    const io = socketIo(server);
    // const watch = new Watch(io);
    ioEvent(io);
    return { server, io };

};
module.exports = init;
