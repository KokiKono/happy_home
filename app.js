import express from 'express';

const app = express();
const port = 8080;

app.use(express.static('front'));

app.get('/', (req, res) => {
    res.send('Hello World hoge');
});

app.listen(port, () => {
    console.log(`happy home app listening on ${port}`);
});