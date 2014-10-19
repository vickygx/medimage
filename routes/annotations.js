var MedImage = require('../data/models/medImage');
var AnnotationController = require('../controllers/annotation');
var PointAnnotation = require('../data/models/annotation/pointAnnotation');
var RangeAnnotation = require('../data/models/annotation/rangeAnnotation');

module.exports = function(app){

  // Get all the annotations of the medical image
  // with the given id
  app.get('/medImages/:id/annotations', function(req, res, next) {
    var id = req.params.id;
    PointAnnotation.find({image_id: id}, function(err, pointAnnotations) {
      if (err) {
        return next(err);
      }

      RangeAnnotation.find({image_id: id}, function(err, rangeAnnotations) {
        if (err) {
          return next(err);
        }

        // Create an array of all point and range annotations for the image
        var annotations = pointAnnotations.concat(rangeAnnotations);
        res.end("GET request made to: " + req.url + "\n and returned: " + annotations);
      });

    });
  });

  // Create a new annotation
  app.post('/annotations', function(req, res, next) {

    var Annotation = AnnotationController.getAnnotationModel(req.body.type);
    var data = req.body;
    data.startPoint = {x: data.start_x, y: data.start_y};
    delete data.start_x;
    delete data.start_y;

    if (data.type == "range") {
      data.endPoint = {x: data.end_x, y: data.end_y};
      delete data.end_x;
      delete data.end_y;
    }

    Annotation.create(data, function(err) {
      if (err) {
        return next(err);
      }
    });

    res.end("POST request made to: " + req.url + " with data: " + JSON.stringify(data));
  });

  // Edit an existing annotation
  app.put('/annotations', function(req, res, next) {
    var Annotation = AnnotationController.getAnnotationModel(req.body.type);
    Annotation.update({_id: req.body.id}, 
    {
      $set: {text: req.body.text}
    }, function(err) {
      if (err) {
        return next(err);
      }
    });
    
    res.end("PUT request made to: " + req.url + " with data: " + JSON.stringify(req.body));
  });

  // Delete an annotation
  app.del('/annotations', function(req, res, next) {
    var Annotation = AnnotationController.getAnnotationModel(req.body.type);

    Annotation.findOne({_id: req.body.id}, function(err, annotation) {
      if (err) {
        return next(err);
      }
      if (annotation) {
        annotation.remove(function(err) {
          if (err) {
            return next(err);
          }
        });
      }
    });

    res.end("DELETE request made to: " + req.url + " with data: " + JSON.stringify(req.body));
  });

};