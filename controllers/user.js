var User = require('../data/models/user');

module.exports.getAllUsers = function(callback) {
  User.find({}, function(err, users) {
    if (err) {
      return callback(err);
    }

    callback(null, users);
  });
}

module.exports.createUser = function(data, callback) {

  User.findOne({username: data.username}, function(err, user) {
    if (err) {
      return callback(err);
    }

    if (user) {
      var err = {
        status: 500, 
        name: "Bad input", 
        message: "A user with this username already exists"
      }
      return callback(err);
    }

    User.create(data, function(err) {
      if (err) {
        return callback(err);
      }

      callback();
    });
  });
}

module.exports.editUser = function(username, data, callback) {
  
  User.findOne({username: username}, function(err, user) {

    if (err) {
      return callback(err);
    }

    if (user) {
      for (var key in data) {
        user[key] = data[key];
      }
      user.save();
      callback();
    } else {
      var err = {
        status: 500, 
        name: "Bad input", 
        message: "Unable to find the user with the given username"
      };
      return callback(err);
    }
  });
}

module.exports.deleteUser = function(username, callback) {

  User.findOne({username: username}, function(err, user) {
    if (err) {
      return callback(err);
    }
    if (user) {
      user.remove(function(err) {
        if (err) {
          return callback(err);
        }
        callback();
      });
    } else {
      var err = {
        status: 500, 
        name: "Bad input", 
        message: "Unable to find the user with the given username"
      };
      return callback(err);
    }
  });
}