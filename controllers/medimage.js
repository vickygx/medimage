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
 * @param {ObjectID} userID - userID for user-specific folder
 * @return {String}
 */
var getUploadFolderPath = function(env, userID) {
  var folderPath = __dirname + "/..";
  if (env === "development") {
    folderPath += "/public/local";
  } else {
    folderPath += "/public/prod";
  }
  folderPath += "/uploads/" + userID;

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
 * Gets the medImage by ID
 *
 * @param {ObjectID} imageID - id of image
 * @param {Function} callback - callback called after getting images
 */
module.exports.getMedImageByID = function(imageID, callback) {
  MedImage.findById(imageID, callback);
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
module.exports.getMedImageURLs = function(imageIDs, callback) {
  MedImage.find({ _id: {$in: imageIds}}, callback);
}

/**
 * Uploads an image by reading the path file and writing it to the 
 * new directory
 *
 * @param {JSON} medImage - image file object as returned in req.files
 * @param {String} env - environment of app
 * @param {ObjectID} userID - id of user who uploaded image
 * @param {String} title - title of image
 * @param {Function} callback - callback called after uploading
 */
module.exports.uploadImage = function(medImage, env, userID, title, callback) {
 //build folder path if doesn't exist
  var folderPath = getUploadFolderPath(env, userID);
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
    var imageURL = '/uploads/images/' + userID + "/" + fileName + fileType;

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
          callback(err, {_id: image._id, title: title, imageURL: imageURL});
        });
      });
    });
  });
}

/**
 * Delete medImage from mongo and file associated with it
 *
 * @param medImage - image doc from db to delete
 * @param env - environment of app
 * @param callback - callback called after deleting
 */
module.exports.deleteImage = function(medImage, env, callback) {
  //get image path
  var folderPath = getUploadFolderPath(env, medImage._creator);
  var parseURLList = medImage.image_url.split("/");
  var fileName = parseURLList[parseURLList.length - 1];
  var imagePath = folderPath + "/" + fileName;

  //delete from directory
  fs.unlink(path.resolve(imagePath), function(err) {
    if (err) {
      return callback(err);
    }

    MedImage.findOneAndRemove({ _id: medImage._id }, function(err) {
      callback(err, {});
    });
  });
}