import express from 'express';
import morgan from 'morgan';

import { eventLogger, motionLogger, consoleLogger } from './log';
import configFile from '../config.json';
import apiRouter from './routers/api';
import managementRouter from './routers/management';
import socket from './socket/index';
import Watch from './watch/index';
import presentation from './presentation/mock';

eventLogger.debug('boot');
motionLogger.debug('boot');

const app = express();
const config = configFile[process.env.NODE_ENV];

const Socket = socket(app);
const watch = Watch(Socket.io);

app.socket = Socket;

app.set('view engine', 'ejs');

app.use(morgan({ format: 'dev', immediate: true }));
app.use('/main', express.static('views/main'));
app.use('/sub', express.static('views/sub'));
app.use('/animation', express.static('animation'));
app.use('/public', express.static('views/public'));

app.get('/', (req, res) => {
    res.send('Hello World hoge');
});

app.use('/api', apiRouter);

app.use('/management', managementRouter);

Socket.server.listen(config.server.port, () => {
    console.log(`happy home app mode is ${process.env.NODE_ENV} listening on ${config.server.port}`);
});

// うざいので、
// presentation(app);
