//Dependency Modules
var fs = require('fs');
var path = require('path')
var MedImage = require('../data/models/medimage');

/**
 * Gets the MedImages from a user
 *
 * @param userID - id of the user
 * @param callback - callback called after getting images
 */
module.exports.getMedImagesByUserID = function(userID, callback) {
  MedImage.find({ user_id: userID }, function(err, images) {
    callback(err, images);
  });
}

/**
 * Returns the folder path for MedImage
 *
 * @param env - environment of app
 * @param userID - userID for user-specific folder
 */
module.exports.getUploadFolderPath = function(env, userID) {
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
 * Uploads an image by reading the path file and writing it to the 
 * new directory
 *
 * @param medImage - image file object as returned in req.files
 * @param userID - id of user who uploaded image
 * @param callback - callback called after uploading
 */
module.exports.uploadImage = function(medImage, uploadFolder, userID, callback) {
  //get fileName, remove spaces and .png/.jpg, shrink name <=10 chars, lowercase
  var fileName = medImage.name;
  fileName = fileName.replace(/(\s+)|(\.png)|(\.jpg)/g, '')
                     .slice(0, 10).toLowerCase();
  fileName += Date.now();

  var fileType = (medImage.type === "image/png") ? ".png" : ".jpg";

  //get upload path
  var uploadPath = uploadFolder + "/" + fileName + fileType;
  uploadPath = path.resolve(uploadPath);

  //set imageURL
  var imageURL = '/uploads/images/' + userID + "/" + fileName + fileType;

  fs.readFile(medImage.path, function(err, data) {
    fs.writeFile(uploadPath, data, function (err) {
      if (err) {
        callback(err);
        return;
      }
      
      //upload image into db
      var image = new MedImage({
        user_id: userID,
        image_url: imageURL
      });

      image.save(function(err) {
        callback(err, {uploadPath: uploadPath, imageURL: imageURL});
      });
    });
  });
}