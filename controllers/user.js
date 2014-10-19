var User = require('../data/models/user');

module.exports.getAllUsers = function(req, res, next, callback) {
  User.find({}, function(err, users) {
    if (err) {
      return next(err);
    }

    callback(req, res, users);
  });
}

module.exports.createUser = function(req, res, next, callback) {
  User.create(req.body, function(err) {
    if (err) {
      return next(err);
    }
    callback(req, res);
  });
}

module.exports.editUser = function(req, res, next, callback) {
  // Empty inputs are not considered
  var updateData = {}
  if (req.body.first_name.length != 0) {
    updateData.first_name = req.body.first_name;
  } 
  if (req.body.last_name.length != 0) {
    updateData.last_name = req.body.last_name;
  } 
  if (req.body.password.length != 0) {
    updateData.password = req.body.password;
  }

  User.update({username: req.body.username}, 
  {
    $set: updateData
  }, function(err) {
    if (err) {
      return next(err);
    }
    callback(req, res)
  });
}

module.exports.deleteUser = function(req, res, next, callback) {
  User.findOne({username: req.body.username}, function(err, user) {
    if (err) {
      return next(err);
    }
    if (user) {
      user.remove(function(err) {
        if (err) {
          return next(err);
        }
        callback(req, res, user);
      });
    }
  });
}