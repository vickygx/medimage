var MedImage = require('../data/models/medImage');
var AnnotationController = require('../controllers/annotation');
var PointAnnotation = require('../data/models/annotation/pointAnnotation');
var RangeAnnotation = require('../data/models/annotation/rangeAnnotation');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function(app){

  var errors = {
    missingTypeError: {
      status: 500, 
      name: "Missing input", 
      message: "You must provide the type of annotation to create"
    }, 
    invalidIdError: {
      status: 500, 
      name: "Bad Input", 
      message: "The given id is not a valid ObjectId"
    }
  }

  var errorChecking = (function() {
    
    var missingType = function(type, next) {
      if (!type) {
        return next(errors.missingTypeError);
      }
    }

    var invalidId = function(id, next) {
      if (!ObjectId.isValid(id)) {
        return next(errors.invalidIdError);
      }
    }

    return {
      missingType: missingType, 
      invalidId: invalidId
    }
  })();

  // Get all the annotations of the medical image
  // with the given id
  app.get('/medImages/:id/annotations', function(req, res, next) {

    var id = req.params.id;

    errorChecking.invalidId(id, next);

    AnnotationController.getMedImageAnnotations(id, function(err, data) {
      if (err) {
        return next(err);
      }

      res.json(data);
      res.end();
    });
  });

  // Create a new annotation
  app.post('/annotations', function(req, res, next) {

    var data = req.body;

    errorChecking.invalidId(data.image_id, next);
    errorChecking.missingType(data.type, next);

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
      res.end();
    });
  });

  // Edit an existing annotation
  app.put('/annotations', function(req, res, next) {

    var id = req.body.id
    var type = req.body.type;

    errorChecking.invalidId(id, next);
    errorChecking.missingType(type, next);

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
      res.end();
    });
  });

  // Delete an annotation
  app.del('/annotations', function(req, res, next) {

    var id = req.body.id;
    var type = req.body.type;

    errorChecking.missingType(req.body.type, next);
    errorChecking.invalidId(id, next);

    AnnotationController.deleteAnnotation(id, type, function(err) {
      if (err) {
        return next(err);
      }

      res.end();
    });
  });

};