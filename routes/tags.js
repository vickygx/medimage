var TagController = require('../controllers/tag');

module.exports = function(app){
  // Get all the tags of the medical image with given id
  app.get('/tag/:imageid', function(req, res) {
    var imageId = req.params.imageid;
    TagController.getTagsOf(imageId, function(err, tags){
      if (err)
        res.send({text: 'Error'});
      else {
        res.send({text: 'imageId given is:' + imageId
                      + 'with tags: ' + tags});
      }
    });
    
  });

  // Create or add tag for photo with given id
  app.post('/tag/:imageid', function(req, res){
    var imageId = req.params.imageid;
    var tagName = req.body.tag;

    TagController.addTagTo(imageId, tagName, function(err, tag){
      if (err)
        res.send({text: 'Error'});
      else {
         res.send({text: 'Adding tag: ' + tagName + ' to ' + imageId});
      }
    });
  });

  // Remove tag off of photo with given id
  app.del('/tag/:imageid', function(req, res){
    var imageId = req.params.imageid;
    var tagName = req.body.tag;

    TagController.removeTagFrom(imageId, tagName, function(err, tag){
      if (err)
        res.send({text: 'Error'});
      else {
        res.send({text: 'Removing tag: ' + tagName + ' from ' + imageId});
      }
    });
    
  });

 
  //  Get all the photos that have these tags
  app.get('/search', function(req, res) {
    res.send({text: 'data given is:' + JSON.stringify(req.query.tag)});
  });
  
};