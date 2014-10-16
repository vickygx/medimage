
module.exports = function(app){

  // Adds user to collaboration on medical image with given id
  app.post('/collab/:imageid', function(req, res) {

  });

  // Removes user from collaboration on medical image with given id
  app.del('/collab/:imageid', function(Req, res){

  });

  // Sees if user has access to edit medical image with given id
  app.get('/collab/access?id=<imageid>', function(req, res) {

  });

};