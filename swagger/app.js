'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var corser = require("corser");
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
  app.use(corser.create());
  require('./swagger-ui-router.js')(app);
  var config = require('./config.json')[process.env.NODE_ENV];
  var port = config.server.port;
  app.listen(port, () => {
      console.log(`happy home swagger mode is ${process.env.NODE_ENV} listening on ${config.server.port}`);
  });
});
