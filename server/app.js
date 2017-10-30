import express from 'express';
import configFile from '../config.json';
import apiRouter from './routers/api';
import managementRouter from './routers/management';

const app = express();
const config = configFile[process.env.NODE_ENV];

const socket = require('./socket/index')(app);

app.set('view engine', 'ejs');

app.use(express.static('views/sub'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World hoge');
});

app.use('/api', apiRouter);

app.use('/management', managementRouter);

app.listen(config.server.port, () => {
    console.log(`happy home app mode is ${process.env.NODE_ENV} listening on ${config.server.port}`);
});
