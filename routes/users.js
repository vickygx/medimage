var User = require('../data/models/user');
var UserController = require('../controllers/user');

module.exports = function(app) {

  // Gets all users
  app.get('/users', function(req, res, next) {
    
    var showResponse = function(req, res, data) {
      res.end(" and successfully retrieved the following users: " + data);
    }

    UserController.getAllUsers(req, res, next, showResponse);

    res.write("GET request made to: " + req.url);
  });

  // Create a new user
  app.post('/users', function(req, res, next) {

    var showResponse = function(req, res) {
      res.end(" and successfully created user!");
    }

    UserController.createUser(req, res, next, showResponse);

    res.write("POST request made to: " + req.url + " with data: " + JSON.stringify(req.body));
  });

  // Edit an existing user
  app.put('/users', function(req, res, next) {

    var showResponse = function(req, res) {
      res.end(" and successfully edited user!");
    }

    UserController.editUser(req, res, next, showResponse);
    
    res.write("PUT request made to: " + req.url + " with data: " + JSON.stringify(req.body));
  });

  // Delete an user
  app.del('/users', function(req, res, next) {

    var showResponse = function(req, res, user) {
      res.end(" and successfully deleted user:" + req.body.username);
    }

    UserController.deleteUser(req, res, next, showResponse);

    res.write("DELETE request made to: " + req.url + " with data: " + JSON.stringify(req.body));
  });

}