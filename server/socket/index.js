import http from 'http';
import https from 'https';
import socketIo from 'socket.io';
import fs from 'fs';
import * as path from 'path';
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

        socket.on('get event logs', () => {
            fs.readFile('./tmp/event.log', 'utf-8', (err, text) => {
                io.emit('read event logs', text);
            });
        });

        socket.on('get motion logs', () => {
            fs.readFile('./tmp/motion.log', 'utf-8', (err, text) => {
                io.emit('read motion logs', text);
            });
        });

        socket.on('get image', () => {
            io.emit('image update', 'http://localhost:8080/ai/images/test.jpeg');
        });

        setInterval(() => {
            let obj = {
                // name: 10,
                // kaki: 20,
                // // sasi: 30,
                "お父さん": {
                    num: 10,
                    color: '#77D0F9',
                    // color: '#77D0F9',
                },
                "お母さん": {
                    num: 10,
                    color: '#ef5285',
                    // color: '#FF66AD',
                },
                "息子": {
                    num: 10,
                    color: '#60c5ba',
                    // color: '#B7F4CF',
                },
                "娘": {
                    num: 10,
                    color: '#ffc952',
                    // color: '#FCF28A',
                },
                "幸せ指数": {
                    num: 40,
                    color: '#c60019',
                },
            };

            for (const key in obj) {
                obj[key].num = Math.floor(Math.random() * 101);
            }
            console.log(obj);
            io.emit('graph update', obj);
        }, 5000);

        setInterval(() => {
            const url = ['http://localhost:8080/sub', 'http://localhost:8080/animation/sample/sample_animation/project.html'];
            io.emit('url', url[Math.floor(Math.random() * url.length)]);
        }, 10000);

    });


};

const init = function (app) {

    // const server = http.Server(app);
    const server = https.createServer({
        pfx: fs.readFileSync(path.join(__dirname, '../happy_home.pfx')),
        passphrase: 'B61747641',
    }, app);
    const io = socketIo(server);
    // const watch = new Watch(io);
    ioEvent(io);
    return { server, io };

};
module.exports = init;
