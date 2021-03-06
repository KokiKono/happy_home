import express from 'express';
import morgan from 'morgan';
import * as bodyParser from 'body-parser';
import https from 'https';
import * as path from 'path';
import * as fs from 'fs';

import { eventLogger, motionLogger, consoleLogger } from './log';
import configFile from '../config.json';
import apiRouter from './routers/api';
import managementRouter from './routers/management';
import socket from './socket/index';
import Watch from './watch/index';
import familyList from './contorller/views/family_list';
import presentation from './presentation/production';
import mainRouter from './routers/main';
import Led from './models/led';
import * as LedConst from './models/led';

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
app.use('/brawser_camera', express.static('views/brawser_camera'));
app.use('/management', express.static('views/management'));
app.use('/camera', express.static('views/camera_test'));
app.get('/', (req, res) => {
    res.send('Hello World hoge');
});

app.use('/api', (req, res, next) => {
    req.socket = Socket;
    next();
})
app.use('/api', apiRouter);

app.use('/management', (req, res, next) => {
    req.socket = Socket;
    next();
});
app.use('/management', managementRouter);

app.use('/main', mainRouter);

const sslServer = https.createServer({
    pfx: fs.readFileSync(path.join(__dirname, './happy_home.pfx')),
    passphrase: 'B61747641',
}, app);
sslServer.listen(5000);

Socket.server.listen(config.server.port, config.server.url, () => {
    console.log(`happy home app mode is ${process.env.NODE_ENV} listening on https://${config.server.url}:${config.server.port}`);
});


// ライトの初期化
let led = new Led(1);
led.on();
led.setBrightness(LedConst.MAX_BRIGHTNESS);
led.setPreset(LedConst.PRESET_COLOR_GRADATION);

led.close();
// 街灯
led = new Led(2);
led.off();
led.close();


// うざいので、
// presentation(app);
