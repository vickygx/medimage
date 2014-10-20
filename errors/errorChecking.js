var errors = require('./errors');
var ObjectId = require('mongoose').Types.ObjectId;

// Any specific errors go into their own object
module.exports.annotations = {};
module.exports.contributions = {};
module.exports.medImage = {};
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

// Annotation error functions

module.exports.annotations.missingType = function(type, next) {
  if (!type) {
    return next(errors.annotations.missingTypeError);
  }
}