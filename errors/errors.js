
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
  status: 400, 
  name: "Bad Input", 
  message: "The given id is not a valid ObjectId"
}

// Annotation errors ////////////////////////////////////////////////

module.exports.annotations.missingTypeError = {
  status: 400, 
  name: "Missing input", 
  message: "You must provide the type of annotation to create"
}

module.exports.annotations.notFound = {
  status: 400, 
  name: "Bad input", 
  message: "Unable to find the annotation with the given id"
}

// Contributions errors /////////////////////////////////////////////


// MedImage errors //////////////////////////////////////////////////


// Tag errors ///////////////////////////////////////////////////////
module.exports.tags.alreadyExistsError = {
  status: 403, 
  name: "Already exists", 
  message: "This tag is already associated with this Image"
}

// Upload errors ////////////////////////////////////////////////////


// User errors //////////////////////////////////////////////////////

module.exports.users.alreadyExistsError = {
  status: 403, 
  name: "Bad input", 
  message: "A user with this username already exists"
}

module.exports.users.notFound = {
  status: 400, 
  name: "Bad input", 
  message: "Unable to find the user with the given username"
}