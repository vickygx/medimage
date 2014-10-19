var PointAnnotation = require('../data/models/annotation/pointAnnotation');
var RangeAnnotation = require('../data/models/annotation/rangeAnnotation');

/**
 * Returns the correct annotation model based on the given type
 * @param {String} type: type of annotation to get
 *                       ("point", "range")
 * @returns {Mongoose model}
 */
var getAnnotationModel = module.exports.getAnnotationModel = function(type) {
  if (type.toLowerCase() == "point") {
    return PointAnnotation;
  } else if (type.toLowerCase() == "range") {
    return RangeAnnotation;
  }
}

module.exports.getMedImageAnnotations = function(req, res, next, callback) {
  var id = req.params.id;

  res.write(" to the MedImage with id: " + id);

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
      callback(req, res, annotations);
    });

  });
}

module.exports.createAnnotation = function(req, res, next, callback) {
  var Annotation = getAnnotationModel(req.body.type);
  var data = req.body;
  data.start_point = {x: data.start_x, y: data.start_y};
  delete data.start_x;
  delete data.start_y;

  if (data.type == "range") {
    data.end_point = {x: data.end_x, y: data.end_y};
    delete data.end_x;
    delete data.end_y;
  }

  res.write(" with data: " + JSON.stringify(data));

  Annotation.create(data, function(err) {
    if (err) {
      return next(err);
    }
    callback(req, res);
  });
}

module.exports.updateAnnotation = function(req, res, next, callback) {
  var Annotation = getAnnotationModel(req.body.type);

  var updateData = {};
  if (req.body.text && req.body.text.length != 0) {
    updateData.text = req.body.text;
  } 
  if (req.body.start_x && req.body.start_y && 
      req.body.start_x.length != 0 && req.body.start_y.length != 0) {
    updateData.start_point = {x: req.body.start_x, y: req.body.start_y};
  } 
  if (req.body.end_x && req.body.end_y && 
      req.body.end_x.length != 0 && req.body.end_y.length != 0) {
    updateData.end_point = {x: req.body.end_x, y: req.body.end_y};
  } 

  res.write(" with data: " + JSON.stringify(updateData));
  Annotation.update({_id: req.body.id}, 
  {
    $set: updateData
  }, function(err) {
    if (err) {
      return next(err);
    }
    callback(req, res);
  });
}

module.exports.deleteAnnotation = function(req, res, next, callback) {
  var Annotation = getAnnotationModel(req.body.type);

  Annotation.findOne({_id: req.body.id}, function(err, annotation) {
    if (err) {
      return next(err);
    }

    res.write(" with data: " + JSON.stringify(req.body));

    if (annotation) {
      annotation.remove(function(err) {
        if (err) {
          return next(err);
        }
        callback(req, res);
      });
    } else {
      res.end(" and failed to find the given annotation");
    }
  });
}