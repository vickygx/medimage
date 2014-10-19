
// Any specific errors go into their own object
module.exports.annotations = {};
module.exports.contributions = {};
module.exports.medImage = {};
module.exports.tags = {};
module.exports.uploads = {};
module.exports.users = {};

/////////////////////////////////////////////////////////////////////
// Global errors
/////////////////////////////////////////////////////////////////////

module.exports.invalidIdError = {
  status: 500, 
  name: "Bad Input", 
  message: "The given id is not a valid ObjectId"
}

// Annotation errors ////////////////////////////////////////////////

module.exports.annotations.missingTypeError = {
  status: 500, 
  name: "Missing input", 
  message: "You must provide the type of annotation to create"
}

module.exports.annotations.notFound = {
  status: 500, 
  name: "Bad input", 
  message: "Unable to find the annotation with the given id"
}