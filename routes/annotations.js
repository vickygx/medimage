var MedImage = require('../data/models/medImage');
var AnnotationController = require('../controllers/annotation');
var PointAnnotation = require('../data/models/annotation/pointAnnotation');
var RangeAnnotation = require('../data/models/annotation/rangeAnnotation');

module.exports = function(app){

  // Get all the annotations of the medical image
  // with the given id
  app.get('/medImages/:id/annotations', function(req, res, next) {
    res.write("GET request made to: " + req.url);

    AnnotationController.getMedImageAnnotations(req, res, next, function(req, res, data) {
      res.end(" and successfully returned: " + data);
    });
  });

  // Create a new annotation
  app.post('/annotations', function(req, res, next) {
    res.write("POST request made to: " + req.url);

    AnnotationController.createAnnotation(req, res, next, function(req, res) {
      res.end(" and successfully created the given annotation!");
    });
  });

  // Edit an existing annotation
  app.put('/annotations', function(req, res, next) {
    res.write("PUT request made to: " + req.url);

    AnnotationController.updateAnnotation(req, res, next, function(req, res) {
      res.end(" and successfully updated the given annotation!");
    });
  });

  // Delete an annotation
  app.del('/annotations', function(req, res, next) {
    res.write("DELETE request made to: " + req.url);

    AnnotationController.deleteAnnotation(req, res, next, function(req, res) {
      res.end(" and successfully deleted the given annotation!");
    });
  });

};