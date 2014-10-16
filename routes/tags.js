
module.exports = function(app){
  // Create tag for photo with given id
  app.post('/tag/:imageid', function(req, res){

  });

  // Remove tag off of photo with given id
  app.del('/tag/:imageid', function(req, res){

  });

  // Get all the tags of the medical image with given id
  app.get('/tag/:imageid', function(req, res) {

  });

  //  Get all the photos that have these tags
  app.get('/search?tag=<item>&<item>', function(req, res) {

  });
  
};