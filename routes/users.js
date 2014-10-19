var User = require('../data/models/user');
var UserController = require('../controllers/user');

module.exports = function(app) {

  // Gets all users
  app.get('/users', function(req, res, next) {

    res.set('Content-Type', 'text/html');
    
    var showResponse = function(req, res, data) {
      res.end("<div>Successfully retrieved the following users: " + data + "</div>");
    }

    UserController.getAllUsers(req, res, next, showResponse);

    res.write("GET request made to: " + req.url);
  });

  // Create a new user
  app.post('/users', function(req, res, next) {

    var showResponse = function(req, res) {
      res.send("<div>Successfully created user!</div>");
    }

    UserController.createUser(req, res, next, showResponse);

    res.write("POST request made to: " + req.url + " with data: " + JSON.stringify(req.body));
  });

  // Edit an existing user
  app.put('/users', function(req, res, next) {

    var showResponse = function(req, res) {
      res.end("Successfully edited user!");
    }

    UserController.editUser(req, res, next, showResponse);
    
    res.write("PUT request made to: " + req.url + " with data: " + JSON.stringify(req.body));
  });

  // Delete an user
  app.del('/users', function(req, res, next) {

    var showResponse = function(req, res, user) {
      res.end("Successfully deleted user:", user.username);
    }

    UserController.deleteUser(req, res, next, showResponse);

    res.end("DELETE request made to: " + req.url + " with data: " + JSON.stringify(req.body));
  });

}