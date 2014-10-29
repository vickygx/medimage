/*  
*   File that takes care of all the routes dealing with tags
*
*   @author: Vicky Gong
*/

var ContribController = require('../controllers/contribution');
var TagController = require('../controllers/tag');
var MedImageController = require('../controllers/medimage');
var errorChecking = require('../errors/errorChecking');
var errors = require('../errors/errors');

module.exports = function(app){

  // Get all the tags of the medical image with given id
  app.get('/tag/:imageid', function(req, res, next) {
    if (!req.session.user) {
      return next(errors.notLoggedIn);
    }

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
          }
        });
      }
    });  
  });

  // Create or add tag for photo with given id
  app.post('/tag/:imageid', function(req, res, next){
    if (!req.session.user) {
      return next(errors.notLoggedIn);
    }

    var imageId = req.params.imageid;
    var tagName = req.body.tag;

    if (errorChecking.invalidId(imageId)) {
      return next(errors.invalidIdError);
    }

    ContribController.hasAccess(req.session.user._id, imageId, function(err, access) {
      if (err) {
        return next(err);
      } else if (!access.has_access) {
        return next(errors.notAuthorized);
      }

      TagController.addTagTo(imageId, tagName, function(err, tag){
        if (err)
          return next(err);
        else {
          res.json({});
        }
      });
    });
  });

  // Remove tag off of photo with given id
  app.del('/tag/:imageid', function(req, res, next){
    if (!req.session.user) {
      return next(errors.notLoggedIn);
    }

    var imageId = req.params.imageid;
    var tagName = req.body.tag;

    if (errorChecking.invalidId(imageId)) {
      return next(errors.invalidIdError);
    }

    ContribController.hasAccess(req.session.user._id, imageId, function(err, access) {
      if (err) {
        return next(err);
      } else if (!access.has_access) {
        return next(errors.notAuthorized);
      }

      TagController.removeTagFrom(imageId, tagName, function(err, tag){
        if (err)
          return next(err);
        else {
          res.json({});
        }
      });
    });
  });
    
};