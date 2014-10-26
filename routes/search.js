var TagController = require('../controllers/tag');
var MedImageController = require('../controllers/medimage');
var errors = require('../errors/errors');
var errorChecking = require('../errors/errorChecking');

module.exports = function(app){

  //  Request to search through photos by tags
  app.get('/search/tags', function(req, res, next) {
    var tags = Array.isArray(req.query.tag) ? req.query.tag : [req.query.tag];
    var limit = errorChecking.search.isValidLimitType(req.query.limit) ? Number(req.query.limit) : 20;

    // Retrieves a list of photos and tags matched
    // sorted by number of tags
    TagController.searchPhotosWithTags(tags, limit, function(err, photos){
      if (err)
        return next(err);
      res.json(photos);  
    });
    
  });

}