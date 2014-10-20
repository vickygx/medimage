var errors = require('./errors');
var ObjectId = require('mongoose').Types.ObjectId;

// Any specific errors go into their own object
module.exports.annotations = {};
module.exports.contributions = {};
module.exports.medimages = {};
module.exports.tags = {};
module.exports.uploads = {};
module.exports.users = {};

/////////////////////////////////////////////////////////////////////
// Global error functions
/////////////////////////////////////////////////////////////////////

module.exports.invalidId = function(id, next) {
  if (!ObjectId.isValid(id)) {
    return next(errors.invalidIdError);
  }
}

/**
 * Checks if an input field is an empty string (after trimming white space off 
 * the front and end)
 *
 * @param {String} str - input field value for a model
 * @param next - next function called to deal with error, if necessary
 */
module.exports.emptyString = function(str, next) {
  if (str.trim().length === 0) {
    return next(errors.invalidStringError);
  }
}

/**
 * Checks if the app is in a valid environment (development or production)
 *
 * @param {String} env - environment of app given by app variable
 * @param {Function} next - next function called to deal with error, if necessary
 */
module.exports.validAppEnv = function(env, next) {
  if (env !== "development" && env !== "production") {
    return next(errors.invalidAppEnvError);
  }
}

// Annotation error functions

module.exports.annotations.missingType = function(type, next) {
  if (!type) {
    return next(errors.annotations.missingTypeError);
  }
}

// MedImages error functions

/**
 * Checks if image is the correct type
 *
 * @param {String} type - type of image, as given in image file object in req
 * @param {Function} next - next function called to deal with error, if necessary
 */
module.exports.medimages.correctType = function(type, next) {
  if (type !== "image/jpeg" && type !== "image/png") {
    return next(errors.medimages.invalidFileTypeError);
  }
}