'use strict';

var fs = require('fs');
var path = require('path');
var serveStatic = require('serve-static');
var yaml = require('js-yaml');

var SWAGGER_UI_PATH    = '/docs';
var SWAGGER_UI_FILES   = './dist';

var indexHtml = fs.readFileSync(path.join(SWAGGER_UI_FILES, 'index.html'), 'utf-8');
var swaggerJson = yaml.safeLoad(fs.readFileSync('./api/swagger/swagger.yaml', 'utf-8'));

// put relative path for loading url in swagger-ui index.html
indexHtml = indexHtml.replace(
    'url = "http://petstore.swagger.io/v2/swagger.json"',
    'url = "/docs/swagger/"'
);

module.exports = function docsRouter(app) {
    // --------------------------- SwaggerUI -------------------------------------
    app.get("/docs/swagger/", function(req, res){
        var config = require('./config.json')[process.env.NODE_ENV];
        var apiPort = config.api.port;
        var apiHost = config.api.url;
        swaggerJson.host =  apiHost + apiPort;
        res.send(swaggerJson); //return swagger json
    });
    // serve the modified index.html for swagger ui
    app.get(SWAGGER_UI_PATH, function(req, res) {
        res.setHeader('content-type', 'text/html');
        res.send(indexHtml);
    });


    // serve the static assets for swagger ui
    app.use(SWAGGER_UI_PATH, serveStatic(SWAGGER_UI_FILES));
};