'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _swaggerExpress = require('swagger-express');

var _swaggerExpress2 = _interopRequireDefault(_swaggerExpress);

var _mock = require('./mock');

var _mock2 = _interopRequireDefault(_mock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.PORT || 3500;

app.use(_swaggerExpress2.default.init(app, {
    apiVersion: '1.0',
    swaggerVersion: '1.0',
    swaggerURL: '/swagger',
    swaggerJSON: '/api-docs.json',
    swaggerUI: './public/swagger/',
    basePath: 'http://localhost:3500',
    info: {
        title: 'swagger-express happy home',
        description: 'Swagger + Express = {swagger-express}'
    },
    apis: ['./api.yml']
}));

app.get('/sample', _mock2.default.sample);

app.listen(port, function () {
    console.log('mock api listening on port ' + port + '!');
});
//# sourceMappingURL=app.js.map