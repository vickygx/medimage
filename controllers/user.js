/*  All the functions related to manipulating and retrieving information 
    from the User database

    @author: Danny Sanchez
*/

var User = require('../data/models/user');
var errors = require('../errors/errors');

/**
 * Gets the user by its ID
 *
 * @param {ObjectID} userID - id of user
 * @param {function} callback - callback called after getting user
 */
module.exports.getUserByID = function(userID, callback) {
  User.findById(userID, callback);
}

/**
 * Gets the user by its username
 *
 * @param {String} username - username of user
 * @param {Function} callback - callback called after getting user
 */
module.exports.getUserByUsername = function(username, callback) {
  User.findOne({ username: username }, callback);
}

/**
 * Gets the users in the list of userIDs
 *
 * @param {[ObjectID]} userIDs - list of userIDs
 * @param {Function} callback - callback called after getting users
 */
module.exports.getUsersByIDs = function(userIDs, callback) {
  User.find({ _id: {$in: userIDs}}, callback);
}

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

    User.create(data, callback);
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