module.exports = function(app){
  var fs = require('fs');
  var mkdirp = require('mkdirp');
  var MedImageController = require('../controllers/medimage');
  var ObjectId = require('mongoose').Types.ObjectId;

  // Creates a medical image
  app.post('/medimages', function(req, res) {
    var medImage = req.files.medImage

    //check file type
    if (medImage.type !== "image/jpeg" && medImage.type !== "image/png") {
      res.send(400, "Invalid File Type: file must be a PNG or JPEG");
      return;
    }

    //check app environment
    if (app.settings.env !== "development" && app.settings.env !== "production") {
      res.send(500, "Server Error: Unexpected app environment");
      return;
    }

    //TODO: get real userID
    var userID = "123456789012345678901234";
    if (!ObjectId.isValid(userID)) {
      res.send(500, "Server Error: Invalid userID given");
      return;
    }

    //build folder path if doesn't exist
    var folderPath = MedImageController.getUploadFolderPath(app.settings.env, userID);
    fs.exists(folderPath, function(exists) {
      if (exists) {
        MedImageController.uploadImage(medImage, folderPath, userID, function(err, data) {
          if (err) {
            res.json(500, err);
            return;
          }

          res.json(data);
        });
      } else {
        //make dir because it doesn't exist
        mkdirp(folderPath, function(err) {
          if (err) {
            res.json(500, err);
            return;
          }

          MedImageController.uploadImage(medImage, folderPath, userID, function(err, data) {
            if (err) {
              res.json(500, err);
              return;
            }

            res.json(data);
          });
        });
      }
    });
  });

  // Deletes a medical image
  app.del('/medimages/:id', function(req, res){

  });

  // Gets the medical image with the given id
  app.get('/medimages/:id', function(req, res) {

  });

};