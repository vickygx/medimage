//Module Dependencies
var Contribution = require('../data/models/contribution');

/** 
 * Creates a contribution in the database
 * 
 * @param {ObjectID} userID - id of user as contributor
 * @param {ObjectID} imageID - id of image user has contribution rights to
 * @param {function} callback - callback called after creating contribution
 */
module.exports.createContribution = function(userID, imageID, callback) {
  //Check if created in DB already
  Contribution.findOne({ user_id: userID, image_id: imageID }, function(err, contribution) {
    if (err) {
      return callback(err);
    } else if (contribution) {
      return callback(undefined, {});
    }
    
    //Create new contribution in database
    var newContrib = new Contribution({
      user_id: userID,
      image_id: imageID
    });

    /*newContrib.save(function(err) {
      callback(err, {userID: newContrib.user_id, imageID: newContrib.image_id})
    });*/

    callback(undefined, {userID: newContrib.user_id, imageID: newContrib.image_id})
  });
}

