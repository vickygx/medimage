var PointAnnotation = require('../data/models/annotation/pointAnnotation');
var RangeAnnotation = require('../data/models/annotation/rangeAnnotation');

/**
 * Returns the correct annotation model based on the given type
 * @param {String} type: type of annotation to get
 *                       ("point", "range")
 * @returns {Mongoose model}
 */
var getAnnotationType = module.exports.getAnnotationModel = function(type) {
  if (type.toLowerCase() == "point") {
    return PointAnnotation;
  } else if (type.toLowerCase() == "range") {
    return RangeAnnotation;
  }
}

module.exports.getMedImageAnnotations = function(req, res, next, callback) {
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
      callback(req, res, annotations);
    });

  });
}

module.exports.createAnnotation = function(req, res, next, callback) {
  
}