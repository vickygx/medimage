/*  
*   File that takes care of all the routes dealing with session, logging in, logging out
*
*   @author: Calvin Li
*/

var UserController = require('../controllers/user');

//Error Modules
var Errors = require('../errors/errors');

module.exports = function(app) {

  app.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    UserController.getUserByUsername(username, function (err, user) {
      if (err) {
        return next(err);
      }
      if (user && user.password === password) {
        req.session.user = user;
        res.json({});
      } else {
        return next(Errors.sessions.badLoginError);
      }
    });
  });

  app.post('/logout', function(req, res, next) {
    req.session.destroy();
    res.json({});
  });
}