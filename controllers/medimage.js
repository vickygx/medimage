/*  All the functions related to manipulating and retrieving information 
    from the Med Image database

    @author: Calvin Li
*/

//Dependency Modules
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var MedImage = require('../data/models/medimage');

///////////////// Helper methods /////////////////

/**
 * Returns the folder path for MedImage
 *
 * @param {String} env - environment of app
 * @param {String} username - username for user-specific folder
 * @return {String}
 */
var getUploadFolderPath = function(env, username) {
  var folderPath = __dirname + "/..";
  if (env === "development") {
    folderPath += "/public/local";
  } else {
    folderPath += "/public/prod";
  }
  folderPath += "/uploads/" + username;

  return path.resolve(folderPath);
}

/**
 * Builds the directory for a folder path if necessary
 *
 * @param {String} folderPath - directory path to build
 * @param {Function} callback - callback called after creating directory
 */
var buildDirectory = function(folderPath, callback) {
  fs.exists(folderPath, function(exists) {
    if (exists) {
      callback();
    } else {
      //make dir because it doesn't exist
      mkdirp(folderPath, callback);
    }
  });
}

///////////////// Controller methods /////////////////

/**
* Gets a list of medical images sorted by modification date
*  
* @param {Integer} limit the number of images to be returned
* @param {Function} callback - callback called after getting images
*/
module.exports.getAllMedImages = function(limit, callback){
  MedImage.find({})
    .sort([['_id', -1]])
    .limit(limit)
    .exec(callback);
}

/**
 * Gets the medImage by ID
 *
 * @param {ObjectID} imageID - id of image
 * @param {Function} callback - callback called after getting images
 */
module.exports.getMedImageByID = function(imageID, callback) {
  MedImage.findById(imageID, callback);
}

/**
 * Gets the medImage by ID with creator field populated
 *
 * @param {ObjectID} imageID - id of image
 * @param {Function} callback - callback called after getting images
 */
module.exports.getMedImageByIDPopulated = function(imageID, callback) {
  MedImage.findById(imageID).populate('_creator').exec(callback);
}

/**
 * Gets the MedImages from a user
 *
 * @param {ObjectID} userID - id of the user
 * @param {Function} callback - callback called after getting images
 */
module.exports.getMedImagesByUserID = function(userID, callback) {
  MedImage.find({ _creator: userID }, callback);
}

/**
 * Get medImages given a list of imageIDs
 *
 * @param {[ObjectIDs]} imageIDs - list of imageIDs
 * @param {function} callback - callback called after getting images
 */
module.exports.getMedImagesByIDs = function(imageIDs, callback) {
  MedImage.find({ _id: {$in: imageIDs}}, callback);
}

/**
 * Uploads an image by reading the path file and writing it to the 
 * new directory
 *
 * @param {JSON} medImage - image file object as returned in req.files
 * @param {String} env - environment of app
 * @param {JSON} user - user document from database
 * @param {String} title - title of image
 * @param {Function} callback - callback called after uploading
 */
module.exports.uploadImage = function(medImage, env, user, title, callback) {
  var userID = user._id;
  var username = user.username;

 //build folder path if doesn't exist
  var folderPath = getUploadFolderPath(env, username);
  buildDirectory(folderPath, function(err) {
    if (err) {
      return callback(err);
    }

    //get fileName, remove spaces and .png/.jpg, shrink name <=10 chars, lowercase
    var fileName = medImage.name;
    fileName = fileName.replace(/(\s+)|(\.png)|(\.jpg)/g, '')
                       .slice(0, 10).toLowerCase();
    fileName += Date.now();

    var fileType = (medImage.type === "image/png") ? ".png" : ".jpg";

    //get upload path
    var uploadPath = folderPath + "/" + fileName + fileType;
    uploadPath = path.resolve(uploadPath);

    //set imageURL
    var imageURL = '/uploads/images/' + username + "/" + fileName + fileType;

    //write file to upload path location
    fs.readFile(medImage.path, function(err, data) {
      if (err) {
        return callback(err);
      }

      fs.writeFile(uploadPath, data, function(err) {
        if (err) {
          return callback(err);
        }
        
        //upload image into db
        var image = new MedImage({
          _creator: userID,
          title: title,
          image_url: imageURL
        });

        image.save(function(err) {
          callback(err, {_id: image._id});
        });
      });
    });
  });
}

/**
 * Changes the title of the med image
 *
 * @param {ObjectID} imageID - id of image being chagned
 * @param {String} title - title to change to
 * @param {Function} callback - callback called after editting
 */
module.exports.editMedImageTitle = function(imageID, title, callback) {
  MedImage.findByIdAndUpdate(imageID, {title: title}, callback);
}

/**
 * Delete medImage from mongo and file associated with it
 *
 * @param {JSON} medImage - image doc from db to delete (with creator populated)
 * @param {String} env - environment of app
 * @param {Function} callback - callback called after deleting
 */
module.exports.deleteImage = function(medImage, env, callback) {
  //get image path
  var folderPath = getUploadFolderPath(env, medImage._creator.username);
  var parseURLList = medImage.image_url.split("/");
  var fileName = parseURLList[parseURLList.length - 1];
  var imagePath = folderPath + "/" + fileName;

  //delete from directory
  fs.unlink(path.resolve(imagePath), function(err) {
    if (err) {
      return callback(err);
    }

    //remove from database
    MedImage.findOneAndRemove({ _id: medImage._id }, callback);
  });
}