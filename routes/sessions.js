var UserController = require('../controllers/user');

module.exports = function(app) {

  app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    UserController.getUserByUsername(username, function (err, user) {
      if (err) {
        return handleError(err);
      }
      if (user && user.password === password) {
        req.session.user = user;
        res.redirect('/main');
      } else {
        //Redirect back to log in page
        res.redirect('/');
      }
    });
  });

  app.post('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
  });
}