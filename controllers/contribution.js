//Module Dependencies
var Contribution = require('../data/models/contribution');

/**
 * Checks if the inputed user has access to the inputed image
 *
 * @param {ObjectID} userID - id of user
 * @param {ObjectID} imageID - id of image
 * @param {function} callback - callback called with true/false json
 */
module.exports.hasAccess = function(userID, imageID, callback) {
  Contribution.findOne({ user_id: userID, image_id: imageID }, function(err, contribution) {
    callback(err, {
      has_access: (contribution) ? true : false, 
      contribution_id: (contribution) ? contribution._id : ""
    });
  });
}

/** 
 * Creates a contribution in the database
 * 
 * @param {ObjectID} userID - id of user as contributor
 * @param {ObjectID} imageID - id of image user has contribution rights to
 * @param {function} callback - callback called after creating contribution
 */
module.exports.createContribution = function(userID, imageID, callback) {
  //Check if created in DB already
  module.exports.hasAccess(userID, imageID, function(err, data) {
    if (err) {
      return callback(err);
    } else if (data.has_access) {
      return callback(undefined, {});
    }
    
    //Create new contribution in database
    var newContrib = new Contribution({
      user_id: userID,
      image_id: imageID
    });

    newContrib.save(function(err) {
      callback(err, {userID: newContrib.user_id, imageID: newContrib.image_id})
    });
  });
}

/**
 * Deletes contribution from database
 *
 * @param {ObjectID} contribID - id of contribution
 * @param {function} callback - callback called after deleting contribution
 */
module.exports.deleteContribution = function(contribID, callback) {
  Contribution.findOneAndRemove({ _id: contribID }, function(err) {
    callback(err, {});
  });
}

