var TagController = require('../controllers/tag');
var MedImageController = require('../controllers/medimage');
var errors = require('../errors/errors');
var errorChecking = require('../errors/errorChecking');

module.exports = function(app){

  // Get all the tags of the medical image with given id
  app.get('/tag/:imageid', function(req, res, next) {
    var imageId = req.params.imageid;

    if (errorChecking.invalidId(imageId)) {
      return next(errors.invalidIdError);
    }

    // Checking if imageId exists
    MedImageController.getMedImageByID(imageId, function(err, image){
      if (err)
        return next(err);
      else {
        TagController.getTagsOf(imageId, function(err, tags){
          if (err)
            return next(err);
          else {
            res.json(tags);
            res.end();
          }
        });
      }
    });  
  });

  // Create or add tag for photo with given id
  app.post('/tag/:imageid', function(req, res, next){
    var imageId = req.params.imageid;
    var tagName = req.body.tag;

    if (errorChecking.invalidId(imageId)) {
      return next(errors.invalidIdError);
    }

    TagController.addTagTo(imageId, tagName, function(err, tag){
      if (err)
        return next(err);
      else {
         res.end();
      }
    });
  });

  // Remove tag off of photo with given id
  app.del('/tag/:imageid', function(req, res, next){
    var imageId = req.params.imageid;
    var tagName = req.body.tag;

    if (errorChecking.invalidId(imageId)) {
      return next(errors.invalidIdError);
    }

    TagController.removeTagFrom(imageId, tagName, function(err, tag){
      if (err)
        return next(err);
      else {
        res.end();
      }
    });
  });
    
};