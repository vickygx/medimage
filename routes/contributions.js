//Controller Modules
var ContriController = require('../controllers/contribution');
var MedImageController = require('../controllers/medimage');
var UserController = require('../controllers/user');

//Error modules
var ErrorChecking = require('../errors/errorChecking');
var Errors = require('../errors/errors');

module.exports = function(app) {

  // Adds user to collaboration on medical image with given id
  app.post('/contributions', function(req, res, next) {
    var username = req.body.username;
    var imageID = req.body.image_id;

    //Check if imageID is valid ObjectId
    if (ErrorChecking.invalidId(imageID)) {
      return next(Errors.invalidIdError);
    }

    //Check if image exists
    MedImageController.getMedImageByID(imageID, function(err, image) {
      if (err) {
        return next(err);
      } else if (!image) {
        return next(Errors.medimages.notFound);
      }

      //Check if user exists
      UserController.getUserByUsername(username, function(err, user) {
        if (err) {
          return next(err);
        } else if (!user) {
          return next(Errors.users.notFound);
        }

        //Create contribution, if not made already
        ContriController.createContribution(user._id, imageID, function(err) {
          if (err) { 
            return next(err);
          }

          res.json({});
        });
      });
    });
  });

  // Delete contribution relationship
  app.del('/contributions/:id', function(req, res, next) {
    var contribID = req.params.id;

    //Check if valid objectID
    if (ErrorChecking.invalidId(contribID)) {
      return next(Errors.invalidIdError);
    }

    ContriController.deleteContribution(contribID, function(err) {
      if (err) {
        return next(err);
      }

      res.json({});
    });
  });

  // Sees if user has access to edit medical image with given id
  app.get('/contributions/access', function(req, res, next) {
    var username = req.query.username;
    var imageID = req.query.imageID;

    //Check if userID and imageID are inputted
    if (username.length === 0 || imageID.length === 0) {
      return next(Errors.contributions.accessRequestError);
    }

    //Check if imageID are valid IDs
    if (ErrorChecking.invalidId(imageID)) {
      return next(Errors.invalidIdError);
    }

    UserController.getUserByUsername(username, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(Errors.users.notFound);
      }

      ContriController.hasAccess(user._id, imageID, function(err, data) {
        if (err) {
          return next(err);
        }

        res.json(data);
      });
    });
  });
};