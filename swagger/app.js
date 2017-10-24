'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
  require('./swagger-ui-router.js')(app);
  app.listen(3500);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log(`happy home api listening on 3500`);
  }
});
