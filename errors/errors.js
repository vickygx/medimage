/*  File of specific errors used by the app

    @author: Danny Sanchez, Calvin Li, Vicky Gong
*/

// Any specific errors go into their own object
module.exports.annotations = {};
module.exports.contributions = {};
module.exports.medimages = {};
module.exports.tags = {};
module.exports.search = {};
module.exports.uploads = {};
module.exports.users = {};
module.exports.sessions = {};

/////////////////////////////////////////////////////////////////////
// Global errors
/////////////////////////////////////////////////////////////////////

module.exports.invalidIdError = {
  status: 400, 
  name: "Bad Input", 
  message: "The given id is not a valid ObjectId"
}

module.exports.invalidStringError = {
  status: 400,
  name: "Bad Input",
  message: "A given input is empty or only whitespace"
}

module.exports.invalidAppEnvError = {
  status: 500,
  name: "Invalid Server State",
  message: "Unexpected app environment"
}

module.exports.notLoggedIn = {
  status: 401,
  name: "Not Logged In",
  message: "Not authorized. You must be logged in"
}

module.exports.notAuthorized = {
  status: 401,
  name: "Not Authorized",
  message: "Not authorized to perform this action"
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
module.exports.contributions.accessRequestError = {
  status: 400,
  name: "Bad Request",
  message: "Request requires a Username and an Image ID"
}

// MedImage errors //////////////////////////////////////////////////

module.exports.medimages.invalidFileTypeError = {
  status: 400,
  name: "Invalid File Type",
  message: "File must be a PNG or JPEG"
}

module.exports.medimages.notFound = {
  status: 400,
  name: "Bad Input",
  message: "Unable to find the image"
}


// Tag errors ///////////////////////////////////////////////////////
module.exports.tags.alreadyExistsError = {
  status: 403, 
  name: "Already exists", 
  message: "This tag is already associated with this Image"
}

// Search errors ///////////////////////////////////////////////////////
module.exports.search.invalidLimitValue = {
  status: 400, 
  name: "Limit Value is not a nonnegative integer", 
  message: "Limit must be defined by a nonnegative integer"
}

// Upload errors ////////////////////////////////////////////////////
module.exports.uploads.invalidImageRequestError = {
  status: 400,
  name: "Invalid Image URL",
  message: "The URL does not specify an image"
}

module.exports.uploads.imageNotFoundError = {
  status: 400,
  name: "Bad Input",
  message: "Unable to find the user's image"
}

// User errors //////////////////////////////////////////////////////

module.exports.users.alreadyExistsError = {
  status: 403, 
  name: "Bad input", 
  message: "A user with this username already exists"
}

module.exports.users.notFound = {
  status: 400, 
  name: "Bad input", 
  message: "Unable to find the user"
}

// Session errors ///////////////////////////////////////////////////

module.exports.sessions.badLoginError = {
  status: 400,
  name: "Bad Login",
  message: "Bad login credentials, please try again"
}