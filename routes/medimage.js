module.exports = function(app){
  var MedImageController = require('../controllers/medimage');
  var UserController = require('../controllers/user');
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
    var userID = req.body.user_id;
    var title = req.body.title.trim();
    var medImage = req.files.medImage;

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

    //check if userID is valid ObjectID
    if (!ObjectId.isValid(userID)) {
      res.send(500, "Server Error: Invalid userID given");
      return;
    }

    //check if title (trimmed) is nonempty
    if (title.length === 0) {
      res.send(500, "Server Error: Title must be a non empty string (ignoring whitespace)");
      return;
    }

    //check if user exists in database
    UserController.getUserByID(userID, function(err, user) {
      if (err) {
        res.send(500, "blah");
        return;
      } else if (!user) {
        res.send(500, "User doesn't exist");
        return;
      }

      //upload image
      MedImageController.uploadImage(medImage, app.settings.env, userID, title, function(err, data) {
        if (err) {
          res.json(500, err);
          return;
        }

        res.json(data);
      });
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