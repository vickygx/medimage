var UserController = require('../controllers/user');

module.exports = function(app) {

  // Gets all users
  app.get('/users', function(req, res, next) {

    UserController.getAllUsers(function(err, data) {
      if (err) {
        return next(err);
      }

      res.json(data);
      res.end();
    });
  });

  // Create a new user
  app.post('/users', function(req, res, next) {

    UserController.createUser(req.body, function(err) {
      if (err) {
        return next(err);
      }

      res.end();
    });
  });

  // Edit an existing user
  app.put('/users', function(req, res, next) {

    var updateData = {};
  
    // Empty inputs are not considered
    if (req.body.first_name && req.body.first_name.length != 0) {
      updateData.first_name = req.body.first_name;
    } 
    if (req.body.last_name && req.body.last_name.length != 0) {
      updateData.last_name = req.body.last_name;
    } 
    if (req.body.password && req.body.password.length != 0) {
      updateData.password = req.body.password;
    }

    UserController.editUser(req.body.username, updateData, function(err) {
      if (err) {
        return next(err);
      }

      res.end();
    });
  });

  // Delete an user
  app.del('/users', function(req, res, next) {

    var username = req.body.username;

    UserController.deleteUser(username, function(err) {
      if (err) {
        return next(err);
      }

      res.end();
    });
  });
}