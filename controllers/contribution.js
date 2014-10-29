//Module Dependencies
var Contribution = require('../data/models/contribution');

/**
 * Checks if the inputed user has access to the inputed image
 *
 * @param {ObjectID} userID - id of user
 * @param {ObjectID} imageID - id of image
 * @param {Function} callback - callback called with true/false json
 */
var hasAccess = module.exports.hasAccess = function(userID, imageID, callback) {
  Contribution.findOne({ user_id: userID, image_id: imageID }, function(err, contribution) {
    callback(err, {
      has_access: (contribution) ? true : false, 
      contribution_id: (contribution) ? contribution._id : ""
    });
  });
}

/** 
 * Get contribution by ID
 */
module.exports.getContributionByID = function(id, callback) {
  Contribution.findById(id, callback);
}

/**
 * Gets list of image IDs that a user contributes to
 *
 * @param {ObjectID} userID - id of user as contributor
 * @param {Function} callback - callback called after getting contributions
 */
module.exports.getContributionsByUserID = function(userID, callback) {
  Contribution.find({ user_id: userID}, callback);
}

/**
 * Gets list of user IDs for the contributors of an image
 *
 * @param {ObjectID} imageID - id of MedImage
 * @param {Function} callback - callback called after getting contributions
 */
module.exports.getContributionsByImageID = function(imageID, callback) {
  Contribution.find({ image_id: imageID}, callback);
}


/** 
 * Creates a contribution in the database
 * 
 * @param {ObjectID} userID - id of user as contributor
 * @param {ObjectID} imageID - id of image user has contribution rights to
 * @param {Function} callback - callback called after creating contribution
 */
module.exports.createContribution = function(userID, imageID, callback) {
  //Check if created in DB already
  hasAccess(userID, imageID, function(err, data) {
    if (err) {
      return callback(err);
    } else if (data.has_access) {
      return callback(undefined);
    }
    
    //Create new contribution in database
    var newContrib = new Contribution({
      user_id: userID,
      image_id: imageID
    });

    newContrib.save(function(err) {
      callback(err, {user_id: newContrib.user_id, image_id: newContrib.image_id});
    });
  });
}

/**
 * Deletes contribution from database
 *
 * @param {ObjectID} contribID - id of contribution
 * @param {Function} callback - callback called after deleting contribution
 */
module.exports.deleteContribution = function(contribID, callback) {
  Contribution.findOneAndRemove({ _id: contribID }, callback);
}

/**
 * Delete contributions for an image
 *
 * @param {ObjectID} imageID 
 * @param {Function} callback - callback called after deleting contributions
 */
 module.exports.deleteContributionsForImage = function(imageID, callback) {
  Contribution.remove({ image_id: imageID }, callback);
 }

