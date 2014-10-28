
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
          process.env.OPENSHIFT_MONGODB_DB_PORT + '/medimage';
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
  app.use(express.cookieParser());
  app.use(express.session({secret: "super secret string 3000"}));
  app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
  });
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));

  // Handling Errors
  app.use(function(err, req, res, next) {
    if (err.status === 400) {
      res.send(400, err.message);
    } else if (err.status === 401) {
      res.send(401, err.message);
    } else if (err.status === 403) {
      res.send(403, err.message);
    } else if (err.status === 404) {
      res.send(404, err.message);
    } else if (err.status === 500) {
      res.send(500, err.message);
    } else {
      return next(err);
    }
  });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
require('./routes/index')(app);
require('./routes/sessions')(app);
require('./routes/annotations')(app);
require('./routes/medimage')(app);
require('./routes/tags')(app);
require('./routes/uploads')(app);
require('./routes/users')(app);
require('./routes/contributions')(app);
require('./routes/search')(app);

var port = Number(process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.listen(port, process.env.OPENSHIFT_NODEJS_IP, function() {
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});
