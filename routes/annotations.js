
module.exports = function(app){

  // Get all the annotations of the medical image
  // with the given id
  app.get('/annotation/:imageid', function(req, res) {
    res.end('AnnotationGetBtn clicked');
  });

  // Create a new annotation
  app.post('/annotation', function(req, res) {
    res.end('AnnotationCreateBtn clicked');
  });

  // Edit an existing annotation
  app.put('/annotation', function(req, res) {
    res.end('AnnotationEditBtn clicked');
  });

  // Delete an annotation
  app.del('/annotation', function(res, res) {
    res.end('AnnotationBtn clicked');
  });

};