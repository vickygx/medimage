var PointAnnotation = require('../data/models/annotation/pointAnnotation');
var RangeAnnotation = require('../data/models/annotation/rangeAnnotation');

var getAnnotationType = module.exports.getAnnotationModel = function(type) {
  if (type == "point") {
    return PointAnnotation;
  } else if (type == "range") {
    return RangeAnnotation;
  }
}