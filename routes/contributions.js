module.exports = function(app){

  // Adds user to collaboration on medical image with given id
  app.post('/contributions', function(req, res) {
    //TODO
  });

  // Removes user from collaboration on medical image with given id
  app.del('/contributions/:id', function(req, res) {
    //TODO
  });

  // Sees if user has access to edit medical image with given id
  app.get('/contributions/access', function(req, res) {
    //TODO
  });
};