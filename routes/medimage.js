//Controllers
var MedImageController = require('../controllers/medimage');
var UserController = require('../controllers/user');
var ContribController = require('../controllers/contribution');
var AnnotationController = require('../controllers/annotation');
var TagController = require('../controllers/tag');
var errors = require('../errors/errors');
var errorChecking = require('../errors/errorChecking');


//Error Modules
ErrorChecking = require('../errors/errorChecking');
Errors = require('../errors/errors');

module.exports = function(app) {

  // Gets all medical images
  app.get('/medimages', function(req, res, next){
    var limit = errorChecking.search.isValidLimitType(req.query.limit) ? Number(req.query.limit) : 50;
    var getTags = req.query.tag === 'true' ?  true: false;
    
    // Gets limit number of medical images
    MedImageController.getAllMedImages(limit, function(err, images){
        // get tags for images
        if (getTags){
          var imageIds = images.map(function(image){ return image._id });

          // Gets tags by image id
          TagController.getTagsByImageIDs(imageIds, function(err, tags){
            if (err)
              return next(err);

            // Creates a hash of imageId to tags
            var tagHash = tags.reduce(function(prev, cur){
              prev[cur._id] = cur.tags; 
              return prev;
            }, {});

            res.json({'images': images, 'imageIdToTags': tagHash});
          });
        }
        // If we want to get tags for each medical image
        else {
          res.json({'images': images});
        }
      
    })
  });

  // Gets a medical image by imageID, returns creator populated
  app.get('/medimages/:image_id', function(req, res, next) {

    //Check if id is a valid objectID
    if (ErrorChecking.invalidId(req.params.image_id)) {
      return next(Errors.invalidIdError);
    }

    MedImageController.getMedImageByIDPopulated(req.params.image_id, function(err, medimage) {
      if (err) {
        return next(err);
      }

      res.json(medimage);
    });
  });

  // Gets the medical images for a user
  app.get('/users/:username/medimages', function(req, res, next) {
    var username = req.params.username;
    var getTags = req.query.tag === 'true' ?  true: false;

    //get user
    UserController.getUserByUsername(username, function(err, user) {
      if (err) {
        return next(err);
      } else if (!user) {
        return next(Errors.users.notFound);
      }

      //get images for user
      MedImageController.getMedImagesByUserID(user._id, function(err, images) {
        if (err)
          return next(err);
        
        // get tags for images
        if (getTags){
          var imageIds = images.map(function(image){ return image._id });

          // Gets tags by image id
          TagController.getTagsByImageIDs(imageIds, function(err, tags){
            if (err)
              return next(err);

            // Creates a hash of imageId to tags
            var tagHash = tags.reduce(function(prev, cur){
              prev[cur._id] = cur.tags; 
              return prev;
            }, {});

            res.json({'images': images, 'imageIdToTags': tagHash});
          });
        }
        // If we want to get tags for each medical image
        else {
          res.json({'images': images});
        }
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
              
              res.json({});
            });
          })
        });
      });
    });
  });
};