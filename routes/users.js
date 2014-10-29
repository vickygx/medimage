//Controller Modules
var UserController = require('../controllers/user');

//Error Modules
var Errors = require('../errors/errors');
var ErrorChecking = require('../errors/errorChecking');

module.exports = function(app) {

  // Gets all users
  app.get('/users', function(req, res, next) {
    if (!req.session.user) {
      return next(Errors.notLoggedIn);
    }

    UserController.getAllUsers(function(err, data) {
      if (err) {
        return next(err);
      }

      res.json(data);
    });
  });

  // Create a new user
  app.post('/users', function(req, res, next) {
    //check if any of the parameters are empty strings or whitespace
    var emptyParams = ErrorChecking.emptyString(req.body.first_name);
    emptyParams = emptyParams || ErrorChecking.emptyString(req.body.last_name);
    emptyParams = emptyParams || ErrorChecking.emptyString(req.body.username);
    emptyParams = emptyParams || ErrorChecking.emptyString(req.body.password);
    if (emptyParams) {
      return next(Errors.invalidStringError);
    }

    //trim whitespace for elements but password
    var createData = {
      first_name: req.body.first_name.trim(),
      last_name: req.body.last_name.trim(),
      username: req.body.username.trim(),
      password: req.body.password
    }

    UserController.createUser(createData, function(err, user) {
      if (err) {
        return next(err);
      }

      req.session.user = user;

      res.json({});
    });
  });

  // Edit an existing user
  app.put('/users/:username', function(req, res, next) {
    var updateData = {};
  
    // Empty inputs are not considered
    if (req.body.first_name && req.body.first_name.trim().length != 0) {
      updateData.first_name = req.body.first_name.trim();
    } 
    if (req.body.last_name && req.body.last_name.trim().length != 0) {
      updateData.last_name = req.body.last_name.trim();
    } 
    if (req.body.password && req.body.password.trim().length != 0) {
      updateData.password = req.body.password;
    }

    UserController.editUser(req.params.username, updateData, function(err) {
      if (err) {
        return next(err);
      }

      res.json({});
    });
  });
}