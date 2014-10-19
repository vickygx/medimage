module.exports = function(app){
  var MedImageController = require('../controllers/medimage');
  var ObjectId = require('mongoose').Types.ObjectId;

  // Gets the medical images for a user
  app.get('/users/:id/medimages', function(req, res) {
    //Check if proper userID
    var userID = req.params.id;
    if (!ObjectId.isValid(userID)) {
      res.send(500, "Server Error: Invalid userID given");
      return;
    }

    //Get images for user
    MedImageController.getMedImagesByUserID(userID, function(err, images) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(images);
    });
  });

  // Creates a medical image
  app.post('/medimages', function(req, res) {
    var medImage = req.files.medImage;
    var userID = req.body.user_id;

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

    //check if userID is valid
    if (!ObjectId.isValid(userID)) {
      res.send(500, "Server Error: Invalid userID given");
      return;
    }

    //upload image
    MedImageController.uploadImage(medImage, app.settings.env, userID, function(err, data) {
      if (err) {
        res.json(500, err);
        return;
      }

      res.json(data);
    });
  });

  // Deletes a medical image
  app.del('/medimages/:id', function(req, res){
    //Check if valid id
    var imageID = req.params.id;
    if (!ObjectId.isValid(imageID)) {
      res.json(400, "Invalid Request");
    }

    //get image details for deleting
    MedImageController.getMedImageByID(imageID, function(err, medImage) {
      if (err) {
        res.json(500, err);
        return;
      } else if (!medImage) {
        res.json(400, "Invalid Request");
        return;
      }

      MedImageController.deleteImage(medImage, app.settings.env, function(err, data) {
        if (err) {
          res.json(500, err);
          return;
        }

        res.json(data);
      });
    });
  });
};