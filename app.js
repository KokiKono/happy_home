import express from 'express';
import configFile from './config.json';
import apiRouter from './routers/api';

const app = express();
const config = configFile[process.env.NODE_ENV];
const port = config.server.port;

app.use(express.static('front'));

app.get('/', (req, res) => {
    res.send('Hello World hoge');
});

app.use('/api', apiRouter);


app.listen(port, () => {
    console.log(`happy home app listening on ${port}`);
});
