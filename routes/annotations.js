var MedImage = require('../data/models/medimage');
var AnnotationController = require('../controllers/annotation');
var PointAnnotation = require('../data/models/annotation/pointAnnotation');
var RangeAnnotation = require('../data/models/annotation/rangeAnnotation');

var errors = require('../errors/errors');
var errorChecking = require('../errors/errorChecking');

module.exports = function(app){

  // Get all the annotations of the medical image
  // with the given id
  app.get('/medImages/:id/annotations', function(req, res, next) {

    var id = req.params.id;

    //check if id is valid objectiD
    if (errorChecking.invalidId(id)) {
      return next(errors.invalidIdError);
    }

    AnnotationController.getMedImageAnnotations(id, function(err, data) {
      if (err) {
        return next(err);
      }

      res.json(data);
    });
  });

  // Create a new annotation
  app.post('/annotations', function(req, res, next) {

    var data = req.body;

    console.log("data: ", JSON.stringify(data));

    //Check if imageID is valid objectID
    if (errorChecking.invalidId(data.image_id)) {
      return next(errors.invalidIdError);
    }

    //Check if missing type field
    if (!data.type) {
      return next(errors.annotations.missingTypeError);
    }

    data.start_point = {x: data.start_x, y: data.start_y};
    delete data.start_x;
    delete data.start_y;

    if (data.type == "range") {
      data.end_point = {x: data.end_x, y: data.end_y};
      delete data.end_x;
      delete data.end_y;
    }

    AnnotationController.createAnnotation(req.body.type, data, function(err) {
      if (err) {
        return next(err);
      }

      res.json({});
    });
  });

  // Edit an existing annotation
  app.put('/annotations/:id', function(req, res, next) {

    var id = req.params.id
    var type = req.body.type;

    //Check if imageID is valid objectID
    if (errorChecking.invalidId(id)) {
      return next(errors.invalidIdError);
    }

    //Check if missing type field
    if (!type) {
      return next(errors.annotations.missingTypeError);
    }

    var data = {};
    if (req.body.text && req.body.text.length != 0) {
      data.text = req.body.text;
    } 
    if (req.body.start_x && req.body.start_y && 
        req.body.start_x.length != 0 && req.body.start_y.length != 0) {
      data.start_point = {x: req.body.start_x, y: req.body.start_y};
    } 
    if (req.body.end_x && req.body.end_y && 
        req.body.end_x.length != 0 && req.body.end_y.length != 0) {
      data.end_point = {x: req.body.end_x, y: req.body.end_y};
    } 

    AnnotationController.updateAnnotation(id, type, data, function(err) {
      if (err) {
        return next(err);
      }

      res.json({});
    });
  });

  // Delete an annotation
  app.del('/annotations/:id', function(req, res, next) {

    var id = req.params.id;
    var type = req.body.type;

    //Check if imageID is valid objectID
    if (errorChecking.invalidId(id)) {
      return next(errors.invalidIdError);
    }

    //Check if missing type field
    if (!type) {
      return next(errors.annotations.missingTypeError);
    }

    AnnotationController.deleteAnnotation(id, type, function(err) {
      if (err) {
        return next(err);
      }

      res.json({});
    });
  });

};