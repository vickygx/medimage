module.exports = function(app){
  var fs = require('fs');
  var mkdirp = require('mkdirp');
  var MedImageController = require('../controllers/medimage');

  // Creates a medical image
  app.post('/medimages', function(req, res) {
    var medImage = req.files.medImage

    //check file type
    var fileType = medImage.type;
    if (fileType !== "image/jpeg" && fileType !== "image/png") {
      //ERROR: wrong file type
      res.send(400, "Invalid File Type: file must be a PNG or JPEG");
      return;
    }

    //check app environment
    if (app.settings.env !== "development" && app.settings.env !== "production") {
      //ERROR: unknown environment
      res.send(500, "Server Error: Invalid app environment");
      return;
    }

    //build folder path if doesn't exist
    var userID = "00000000000000000000";
    var folderPath = MedImageController.getUploadFolderPath(app.settings.env, userID);

    fs.exists(folderPath, function(exists) {
      if (exists) {
        MedImageController.uploadImage(medImage, folderPath, function() {
          res.json({
            pathExists: true
          });
        });
      } else {
        //make dir because it doesn't exist
        mkdirp(folderPath, function(err) {
          if (err) {
            res.json(500, err);
            return;
          }

          MedImageController.uploadImage(medImage, folderPath, function() {
            res.json({
              pathExists: false
            })
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