//TODO REMOVE
var errors = require('./errors');
var ObjectId = require('mongoose').Types.ObjectId;

// Any specific errors go into their own object
module.exports.annotations = {};
module.exports.contributions = {};
module.exports.medimages = {};
module.exports.tags = {};
module.exports.uploads = {};
module.exports.users = {};
module.exports.search = {};

/////////////////////////////////////////////////////////////////////
// Global error functions
/////////////////////////////////////////////////////////////////////

/**
 * Returns true if the id is a improper ObjectID, false otherwise
 *
 * @param {String} id
 * @return {Boolean}
 */
module.exports.invalidId = function(id) {
  return !ObjectId.isValid(id);
}

/**
 * Returns true if an input field is an empty string (after trimming white space off 
 * the front and end), false otherwise
 *
 * @param {String} str - input field value for a model
 * @return {Boolean}
 */
module.exports.emptyString = function(str) {
  return (str.trim().length === 0);
}

/**
 * Returns true if the app is in a invalid environment (not development or production),
 * false otherwise
 *
 * @param {String} env - environment of app given by app variable
 * @return {Boolean}
 */
module.exports.invalidAppEnv = function(env) {
  return (env !== "development" && env !== "production");
}

// Annotation error functions

// MedImages error functions

/**
 * Returns true if image is an invalid filetype, false otherwise
 *
 * @param {String} type - type of image, as given in image file object in req
 * @return {Boolean}
 */
module.exports.medimages.invalidFileType = function(type) {
  return (type !== "image/jpeg" && type !== "image/png");
}

// Upload error functions

/**
 * Returns true if request is not a PNG or JPEG, false otherwise
 *
 * @param {String} imageName - imageName in the request path
 * @return {Boolean}
 */
module.exports.uploads.invalidImageRequest = function(imageName) {
  var indexOfPNG = imageName.indexOf(".png");
  var indexOfJPG = imageName.indexOf(".jpg");
  var correctIndex = imageName.length - 4;
  return (indexOfPNG !== correctIndex && indexOfJPG !== correctIndex);
}

// Search error functions

module.exports.search.isValidLimitType = function(limitString, next){
  var limit = ~~Number(limitString);
  return String(limit) === limitString && limit >= 0;
}