module.exports = function(app){
  var mongoose = require('mongoose');
  var ObjectId = mongoose.Types.ObjectId;
  var ContriController = require('../controllers/contribution');
  var MedImageController = require('../controllers/medimage');
  var UserController = require('../controllers/user');

  // Adds user to collaboration on medical image with given id
  app.post('/contributions', function(req, res) {
    var userID = req.body.user_id;
    var imageID = req.body.image_id;

    //Check if valid ObjectIDs
    if (!ObjectId.isValid(userID) || !ObjectId.isValid(imageID)) {
      //TODO: Standardize error message handling
      res.json(500, {msg: "Invalid IDs"});
      return;
    }

    MedImageController.getMedImageByID(imageID, function(err, image) {
      if (err) {
        //TODO: FIX THIS
        res.json(500, err);
        return;
      } else if (!image) {
        //TODO: FIX THIS
        err = {
          status: 500,
          name: "Bad Input",
          message: "Image does not exist"
        }
        res.json(500, err);
        return;
      }

      //TODO: Check if userID is correct
      ContriController.createContribution(userID, imageID, function(err, data) {
        if (err) {
          //TODO FIX THIS
          res.json(500, err);
          return;
        }
        
        res.json(data);
      });
    });
  });

  // Removes user from collaboration on medical image with given id
  app.del('/contributions/:id', function(req, res) {
    //TODO
  });

  // Sees if user has access to edit medical image with given id
  app.get('/contributions/access', function(req, res) {
    //TODO
  });
};