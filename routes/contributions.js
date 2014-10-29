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
    if (!req.session.user) {
      return next(Errors.notLoggedIn);
    }

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
      } else if (image._creator != req.session.user._id) {
        return next(Errors.notAuthorized);
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
    if (!req.session.user) {
      return next(Errors.notLoggedIn);
    }

    var contribID = req.params.id;

    //Check if valid objectID
    if (ErrorChecking.invalidId(contribID)) {
      return next(Errors.invalidIdError);
    }

    ContriController.getContributionByID(contribID, function(err, contribution) {
      if (err) {
        return next(err);
      } else if (!contribution) {
        res.json({});
        return;
      }

      MedImageController.getMedImageByID(contribution.image_id, function(err, image) {
        if (err) {
          return next(err);
        } else if (!image) {
          return next(Errors.medimages.notFound);
        } else if (image._creator != req.session.user._id) {
          return next(Errors.notAuthorized);
        }

        ContriController.deleteContribution(contribID, function(err) {
          if (err) {
            return next(err);
          }

          res.json({});
        });
      });
    });
  });

  // Sees if user has access to edit medical image with given id
  app.get('/contributions/access', function(req, res, next) {
    if (!req.session.user) {
      return next(Errors.notLoggedIn);
    }

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

  //Get all contributions for an image
  app.get('/medimages/:id/contributions', function(req, res, next) {
    if (!req.session.user) {
      return next(Errors.notLoggedIn);
    }

    var imageID = req.params.id;

    MedImageController.getMedImageByID(imageID, function(err, image) {
      if (err) {
        return next(err);
      }

      if (!image) {
        return next(Errors.medimages.notFound);
      }

      ContriController.getContributionsByImageID(imageID, function(err, contributions) {
        //get list of user ids
        var userIDs = contributions.map(function(contribution) { return contribution.user_id });

        //get list of users
        UserController.getUsersByIDs(userIDs, function(err, users) {
          if (err) {
            return next(err);
          }

          //make userID --> user hash
          var userHash = users.reduce(function(hash, user) {
            hash[user._id] = user;
            return hash;
          }, {})

          res.json({contributions: contributions, userIDToUser: userHash});
        });
      });
    });
  });

  //Get all images a user can contribute to
  app.get('/users/:username/contributions', function(req, res, next) {
    if (!req.session.user) {
      return next(Errors.notLoggedIn);
    }

    var username = req.params.username;

    UserController.getUserByUsername(username, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(Errors.users.notFound);
      }

      ContriController.getContributionsByUserID(user._id, function(err, contributions) {
        //get list of image ids
        var imageIDs = contributions.map(function(contribution) { return contribution.image_id });
        
        //get list of images
        MedImageController.getMedImagesByIDs(imageIDs, function(err, images) {
          if (err) {
            return next(err);
          }

          //make imageID --> image hash
          var imageHash = images.reduce(function(hash, image) {
            hash[image._id] = image;
            return hash;
          }, {});

          res.json({contributions: contributions, imageIDToImage: imageHash});
        });
      });
    });
  });
};