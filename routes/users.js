var UserController = require('../controllers/user');

module.exports = function(app) {

  // Gets all users
  app.get('/users', function(req, res, next) {

    res.write("GET request made to: " + req.url);

    UserController.getAllUsers(req, res, next, function(req, res, data) {
      res.end(" and successfully retrieved the following users: " + data);
    });
  });

  // Create a new user
  app.post('/users', function(req, res, next) {

    res.write("POST request made to: " + req.url);

    UserController.createUser(req, res, next, function(req, res) {
      res.end(" and successfully created user!");
    });
  });

  // Edit an existing user
  app.put('/users', function(req, res, next) {

    res.write("PUT request made to: " + req.url);

    UserController.editUser(req, res, next, function(req, res) {
      res.end(" and successfully edited user!");
    });
  });

  // Delete an user
  app.del('/users', function(req, res, next) {

    res.write("DELETE request made to: " + req.url + " with data: " + JSON.stringify(req.body));

    UserController.deleteUser(req, res, next, function(req, res, user) {
      res.end(" and successfully deleted user: " + req.body.username);
    });
  });

}