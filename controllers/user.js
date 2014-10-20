var User = require('../data/models/user');
var errors = require('../errors/errors');
var errorChecking = require('../errors/errorChecking');

/**
 * Retrieves all users present in the database
 * @param {Function} callback: function to call after users are
 *   retrieved.  Retrieved users are passed into this function
 */
module.exports.getAllUsers = function(callback) {
  User.find({}, function(err, users) {
    if (err) {
      return callback(err);
    }

    callback(null, users);
  });
}

/**
 * Creates a new user based on the info passed in the data parameter
 * @param {JSON} data: info used to create user
 * @param {Function} callback: function to call after user is created
 */
module.exports.createUser = function(data, callback) {

  User.findOne({username: data.username}, function(err, user) {
    if (err) {
      return callback(err);
    }

    if (user) {
      return callback(errors.users.alreadyExistsError);
    }

    User.create(data, function(err) {
      if (err) {
        return callback(err);
      }

      callback();
    });
  });
}

/**
 * Edits the user with the given username, with the info passed in data
 * @param {String} username: username of user to edit
 * @param {JSON} data: info used to edit user
 * @param {Function} callback: function to call after user is edited
 */
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
      return callback(errors.users.notFound);
    }
  });
}

/**
 * Deletes the user with the given username
 * @param {String} username: username of user to delete
 * @param {Function} callback: function to call after user is deleted
 */
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
      return callback(errors.users.notFound);
    }
  });
}