import express from 'express';
import apiRouter from './routers/api';

const app = express();
const port = 8080;

app.use(express.static('front'));

app.get('/', (req, res) => {
    res.send('Hello World hoge');
});

app.use('/api', apiRouter);


app.listen(port, () => {
    console.log(`happy home app listening on ${port}`);
});
