//Dependency Modules
var fs = require('fs');
var MedImage = require('../data/models/medImage');

/**
 * Returns the folder path for MedImage
 *
 * @param env - environment of app
 * @param userID - userID for user-specific folder
 */
module.exports.getUploadFolderPath = function(env, userID) {
  var path = __dirname + "/..";
  if (env === "development") {
    path += "/public/local";
  } else {
    path += "/public/prod";
  }
  path += "/uploads/" + userID;

  return path;
}

/**
 * Uploads an image by reading the path file and writing it to the 
 * new directory
 *
 * @param medImage - image file object as returned in req.files
 * @param uploadFolder - dir of where image will be uploaded to
 * @param callback - callback called after uploading
 */
module.exports.uploadImage = function(medImage, uploadFolder, callback) {
  //get fileName, remove spaces and .png/.jpg, shrink name <=10 chars, lowercase
  var fileName = medImage.name;
  fileName = fileName.replace(/(\s+)|(\.png)|(\.jpg)/g, '')
                     .slice(0, 10).toLowerCase();
  fileName += Date.now();

  var fileType = (medImage.type === "image/png") ? ".png" : ".jpg";

  var uploadPath = uploadFolder + "/" + fileName + fileType;

  fs.readFile(medImage.path, function(err, data) {
    fs.writeFile(uploadPath, data, function (err) {
      if (err) {
        res.json(500, err);
        return;
      }
      
      //upload image into db
      var image = new MedImage({
        image_url: uploadPath
      });

      // image.save(function(err) {
      //   if (err) {
      //     res.json(500, err);
      //     return;
      //   }

      //   callback();
      // });

      callback();
    });
  });
}