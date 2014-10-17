
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();

// Setup mongoose
var dbName = 'MedImage';
var dbURL = 'localhost/' + dbName;
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  dbURL = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
          process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
          process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
          process.env.OPENSHIFT_MONGODB_DB_PORT + '/' + dbName;
}
var db = require('mongoose').connect(dbURL, function() {
  console.log("Successfully connected to MongoDB at: \n", dbURL);
});

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
require('./routes/index')(app);
require('./routes/annotations')(app);
require('./routes/medImage')(app);
require('./routes/tags')(app);

var port = Number(process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.listen(port, process.env.OPENSHIFT_NODEJS_IP, function() {
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});
