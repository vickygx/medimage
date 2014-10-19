var User = require('../data/models/user');

module.exports.getAllUsers = function(req, res, next, callback) {
  User.find({}, function(err, users) {
    if (err) {
      return next(err);
    }

    if (callback) {
      callback(req, res, users);
    }
  });
}

module.exports.createUser = function(req, res, next, callback) {
  
  res.write(" with data :" + JSON.stringify(req.body));

  User.create(req.body, function(err) {
    if (err) {
      return next(err);
    }
    if (callback) {
      callback(req, res);
    }
  });
}

module.exports.editUser = function(req, res, next, callback) {
  // Empty inputs are not considered
  var updateData = {};
  if (req.body.first_name && req.body.first_name.length != 0) {
    updateData.first_name = req.body.first_name;
  } 
  if (req.body.last_name && req.body.last_name.length != 0) {
    updateData.last_name = req.body.last_name;
  } 
  if (req.body.password && req.body.password.length != 0) {
    updateData.password = req.body.password;
  }

  res.write(" with data: " + JSON.stringify(updateData));

  User.update({username: req.body.username}, 
  {
    $set: updateData
  }, function(err) {
    if (err) {
      return next(err);
    }
    if (callback) {
      callback(req, res);
    }
  });
}

module.exports.deleteUser = function(req, res, next, callback) {
  
  res.write(" to the user with username: " + req.body.username);

  User.findOne({username: req.body.username}, function(err, user) {
    if (err) {
      return next(err);
    }
    if (user) {
      user.remove(function(err) {
        if (err) {
          return next(err);
        }
        if (callback) {
          callback(req, res);
        }
      });
    } else {
      res.end("Unable to find user: " + req.body.username);
    }
  });
}