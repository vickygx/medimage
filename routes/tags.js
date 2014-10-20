var TagController = require('../controllers/tag');
var MedImageController = require('../controllers/medimage');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function(app){

  var errors = {
    missingTypeError: {
      status: 500, 
      name: "Missing input", 
      message: "You must provide the type of annotation to create"
    }, 
    invalidIdError: {
      status: 500, 
      name: "Bad Input", 
      message: "The given id is not a valid ObjectId"
    }
  }

  var errorChecking = (function() {
    
    var missingType = function(type, next) {
      if (!type) {
        return next(errors.missingTypeError);
      }
    }

    var invalidId = function(id, next) {
      if (!ObjectId.isValid(id)) {
        return next(errors.invalidIdError);
      }
    }

    return {
      missingType: missingType, 
      invalidId: invalidId
    }
  })();

  // Get all the tags of the medical image with given id
  app.get('/tag/:imageid', function(req, res, next) {
    var imageId = req.params.imageid;

    errorChecking.invalidId(imageId, next);

    // Checking if imageId exists
    MedImageController.getMedImageByID(imageId, function(err, image){
      if (err)
        return next(err);
      else {
        TagController.getTagsOf(imageId, function(err, tags){
          if (err)
            return next(err);
          else {
            res.send({text: 'image: ' + imageId
                          + '\n has tags: ' + tags});
          }
        });
      }
    });  
  });

  // Create or add tag for photo with given id
  app.post('/tag/:imageid', function(req, res, next){
    var imageId = req.params.imageid;
    var tagName = req.body.tag;

    TagController.addTagTo(imageId, tagName, function(err, tag){
      if (err)
        return next(err);
      else {
         res.send({text: 'Adding tag: ' + tagName + ' to ' + imageId});
      }
    });
  });

  // Remove tag off of photo with given id
  app.del('/tag/:imageid', function(req, res, next){
    var imageId = req.params.imageid;
    var tagName = req.body.tag;

    TagController.removeTagFrom(imageId, tagName, function(err, tag){
      if (err)
        return next(err);
      else {
        res.send({text: 'Removing tag: ' + tagName + ' from ' + imageId});
      }
    });
    
  });

 
  //  Get all the photos that have these tags
  app.get('/search', function(req, res, next) {
    var tags = Array.isArray(req.query.tag) ? req.query.tag : [req.query.tag];

    TagController.getPhotosWithEveryTag(tags, function(err, photos){
      if (err)
        return next(err);
      res.send({text: 'photo ids: ' + photos});  
    });
    
  });
  
};