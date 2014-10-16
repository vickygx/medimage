
module.exports = function(app){

  // Get all the annotations of the medical image
  // with the given id
  app.get('/annotation/:imageId', function(req, res) {
    res.end("data: annotationsGetBtn");
  });

  // Create a new annotation
  app.post('/annotation', function(req, res) {
    res.end("data: " + req.body.message);
  });

  // Edit an existing annotation
  app.put('/annotation', function(req, res) {
    res.end("data: " + req.body.message);
  });

  // Delete an annotation
  app.del('/annotation', function(req, res) {
    res.end("data: " + req.body.message);
  });

};