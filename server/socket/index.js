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
            const rand = Math.floor(Math.random() * 11);
            let array = [];
            for (let i = 0; i < rand; i++) {
                array.push(Math.floor(Math.random() * 101));
            }
            io.emit('graph update', array);
        }, 5000);

        setInterval(() => {
            const url = [ "http://localhost:8080/sub", "http://localhost:8080/animation/sample/sample_animation/project.html" ];
            io.emit('url', url[ Math.floor( Math.random() * url.length ) ]);
        }, 10000);
        
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
