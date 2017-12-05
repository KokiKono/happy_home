import express from 'express';
import morgan from 'morgan';
import * as bodyParser from 'body-parser';

import { eventLogger, motionLogger, consoleLogger } from './log';
import configFile from '../config.json';
import apiRouter from './routers/api';
import managementRouter from './routers/management';
import socket from './socket/index';
import Watch from './watch/index';
import presentation from './presentation/mock';
import familyList from './contorller/views/family_list';
import mainRouter from './routers/main';
eventLogger.debug('boot');
motionLogger.debug('boot');

const app = express();
const config = configFile[process.env.NODE_ENV];

const Socket = socket(app);
const watch = Watch(Socket.io);

app.socket = Socket;

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan({ format: 'dev', immediate: true }));
app.use('/sub', express.static('views/sub'));
app.use('/animation', express.static('animation'));
app.use('/public', express.static('views/public'));
app.use('/main', express.static('views/main'));

app.get('/', (req, res) => {
    res.send('Hello World hoge');
});

app.use('/api', apiRouter);

app.use('/management', managementRouter);

app.use('/main', mainRouter);

Socket.server.listen(config.server.port, config.server.url, () => {
    console.log(`happy home app mode is ${process.env.NODE_ENV} listening on http://${config.server.url}:${config.server.port}`);
});

// うざいので、
// presentation(app);
