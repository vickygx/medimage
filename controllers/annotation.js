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