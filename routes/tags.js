
module.exports = function(app){
  // Create or add tag for photo with given id
  app.post('/tag/:imageid', function(req, res){
    res.send({text: 'data given is:' + JSON.stringify(req.body)});

  });

  // Remove tag off of photo with given id
  app.del('/tag/:imageid', function(req, res){
    res.send({text: 'data given is:' + JSON.stringify(req.body)});
  });

  // Get all the tags of the medical image with given id
  app.get('/tag/:imageid', function(req, res) {
    res.send({text: 'data given is:' + JSON.stringify(req.body)});
  });

  //  Get all the photos that have these tags
  app.get('/search', function(req, res) {
    res.send({text: 'data given is:' + JSON.stringify(req.query.tag)});
  });
  
};