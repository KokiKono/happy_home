import express from 'express';
import swagger from 'swagger-express';
import api from './mock';

const app = express();
const port = process.env.PORT || 3500;

app.use(swagger.init(app, {
    apiVersion: '1.0',
    swaggerVersion: '1.0',
    swaggerURL: '/swagger',
    swaggerJSON: '/api-docs.json',
    swaggerUI: './api/mock/public/swagger/',
    basePath: 'http://localhost:3500',
    info: {
        title: 'swagger-express happy home',
        description: 'Swagger + Express = {swagger-express}'
    },
    apis: ['./api.yml'],
}));

app.get('/login', api.login);

app.listen(port, () => {
    console.log(`mock api listening on port ${port}!`);
});