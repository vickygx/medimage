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

    //Check if image exists
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

      //Check if user exists
      UserController.getUserByID(userID, function(err, user) {
        if (err) {
          //TODO: Fix this
          res.json(500, err);
          return;
        } else if (!user) {
        //TODO: FIX THIS
          err = {
            status: 500,
            name: "Bad Input",
            message: "User does not exist"
          }
          res.json(500, err);
          return;
        }

        //Create contribution, if not made already
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
  });

  // Removes user from collaboration on medical image with given id
  app.del('/contributions/:id', function(req, res) {
    var contribID = req.params.id;

    //Check if valid objectID
    if (!ObjectId.isValid(contribID)) {
      //TODO FIX
      res.json(500, {
        status: 500,
        name: "Bad Request",
        message: "Invalid user ID"
      });
      return;
    }

    ContriController.deleteContribution(contribID, function(err, data) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(data);
    });

  });

  // Sees if user has access to edit medical image with given id
  app.get('/contributions/access', function(req, res) {
    var userID = req.query.userID;
    var imageID = req.query.imageID;

    //Check if userID and imageID are inputted
    if (userID.length === 0 || imageID.length === 0) {
      //TODO: FIX THIS
      var err = {
        status: 400,
        name: "Bad Request",
        message: "Request requires a User ID and an Image ID"
      }
      res.json(400, err);
      return;
    }

    //Check if userID and imageID are valid IDs
    if (!ObjectId.isValid(userID) || !ObjectId.isValid(imageID)) {
      res.json(400, {
        status: 400,
        name: "Bad Input",
        message: "Invalid User ID or Image ID given"
      });
      return;
    }

    ContriController.hasAccess(userID, imageID, function(err, data) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(data);
    });
  });
};