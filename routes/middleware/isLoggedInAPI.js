var Errors = require('../../errors/errors');

module.exports = function(req, res, next) {
  var err = undefined;
  if (!req.session.user) {
    err = Errors.notLoggedIn;
  }
  next(err);
}

