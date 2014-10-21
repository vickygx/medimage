//Controllers
var MedImageController = require('../controllers/medimage');
var UserController = require('../controllers/user');
var ContribController = require('../controllers/contribution');
var AnnotationController = require('../controllers/annotation');
var TagController = require('../controllers/tag');

//Error Modules
ErrorChecking = require('../errors/errorChecking');
Errors = require('../errors/errors');

module.exports = function(app) {

  // Gets the medical images for a user
  app.get('/users/:username/medimages', function(req, res, next) {
    var username = req.params.username;

    //get user
    UserController.getUserByUsername(username, function(err, user) {
      if (err) {
        return next(err);
      } else if (!user) {
        return next(Errors.users.notFound);
      }

      //get images for user
      MedImageController.getMedImagesByUserID(user._id, function(err, images) {
        if (err) {
          return next(err);
        }
        res.json(images);
        res.end();
      });
    });
  });

  // Creates a medical image
  app.post('/medimages', function(req, res, next) {
    var username = req.body.username;
    var title = req.body.title.trim();
    var medImage = req.files.medImage;

    //check file type
    if (ErrorChecking.medimages.invalidFileType(medImage.type)) {
      return next(Errors.medimages.invalidFileTypeError);
    }

    //check app environment
    if (ErrorChecking.invalidAppEnv(app.settings.env)) {
      return next(Errors.invalidAppEnvError);
    }

    //check if title (trimmed) is nonempty
    if (ErrorChecking.emptyString(title)) {
      return next(Errors.invalidStringError);
    }

    //check if user exists in database
    UserController.getUserByUsername(username, function(err, user) {
      if (err) {
        return next(err);
      } else if (!user) {
        return next(Errors.users.notFound);
      }

      //upload image
      MedImageController.uploadImage(medImage, app.settings.env, user, title, function(err, data) {
        if (err) {
          return next(err);
        }

        //Create contribution for user with image
        ContribController.createContribution(user._id, data._id, function(err) {
          if (err) {
            return next(err);
          }

          res.json({});
          res.end();        
        });
      });
    });
  });

  //Editing a medical image (only title field)
  app.put('/medimages/:id', function(req, res, next) {
    var imageID = req.params.id;
    var title = req.body.title;

    //Check if id is a valid objectID
    if (ErrorChecking.invalidId(imageID)) {
      return next(Errors.invalidIdError);
    }

    //Check if title is empty or whitespace
    if (ErrorChecking.emptyString(title)) {
      return next(Errors.invalidStringError);
    }

    MedImageController.editMedImageTitle(imageID, title, function(err, image) {
      if (err) {
        return next(err);
      }
      if (!image) {
        return next(Errors.medimages.notFound);
      }

      res.json({});
      res.end();
    });
  });

  // Deletes a medical image
  app.del('/medimages/:id', function(req, res, next) {
    //Check if valid id
    var imageID = req.params.id;
    if (ErrorChecking.invalidId(imageID)) {
      return next(Errors.invalidIdError);
    }

    //get image details for deleting
    MedImageController.getMedImageByIDPopulated(imageID, function(err, medImage) {
      if (err) {
        return next(err);
      } else if (!medImage) {
        return next(Errors.medimages.notFound);
      }

      //Delete image
      MedImageController.deleteImage(medImage, app.settings.env, function(err) {
        if (err) {
          return next(err);
        }

        //Delete contributions
        ContribController.deleteContributionsForImage(imageID, function(err) {
          if (err) {
            return next(err);
          }

          //Delete annotations
          AnnotationController.deleteAnnotationsForImage(imageID, function(err) {
            if (err) {
              return next(err);
            }

            //Delete tags
            TagController.removeTagsFrom(imageID, function(err) {
              if (err) {
                return next(err);
              }
              
              res.end();
            });
          })
        });
      });
    });
  });
};