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

/**
 * Gets all annotations for the medical image with the image_id that is 
 * req.params.id
 * Then performs the given callback, passing in the found annotations
 */
module.exports.getMedImageAnnotations = function(imageId, callback) {

  PointAnnotation.find({image_id: imageId}, function(err, pointAnnotations) {
    if (err) {
      return callback(err);
    }

    RangeAnnotation.find({image_id: imageId}, function(err, rangeAnnotations) {
      if (err) {
        return callback(err);
      }

      // Create an array of all point and range annotations for the image
      var annotations = pointAnnotations.concat(rangeAnnotations);
      callback(null, annotations);
    });

  });
}

/**
 * Creates a new annotation based on the fields given in req.body
 * req.body keys should match annotations schema keys
 * Creates a point annotation if req.body.type == "point"
 *   or a range annotation if req.body type == "range"
 * Performs the given callback after the annotation is created
 */
module.exports.createAnnotation = function(type, data, callback) {
  
  var Annotation = getAnnotationModel(type);

  Annotation.create(data, function(err) {
    if (err) {
      return callback(err);
    }
    callback();
  });
}

/**
 * Updates the annotation with _id given by req.body.id
 * Can update text, start_point, and end_point
 * start_point and end_point only updated if x and y are given
 * The performs given callback
 */
module.exports.updateAnnotation = function(id, type, data, callback) {
  
  var Annotation = getAnnotationModel(type);

  Annotation.findOne({_id: id}, function(err, annotation) {
    if (err) {
      return callback(err);
    }
    if (annotation) {
      for (var key in data) {
        annotation[key] = data[key];
      }
      annotation.save();
      callback();
    } else {
      var err = {
        status: 500, 
        name: "Bad input", 
        message: "Unable to find the annotation with the given id"
      };
      return callback(err);
    }
  });
}

/**
 * Deletes the annotation with _id given by req.body.id
 * Then performs the given callback
 */
module.exports.deleteAnnotation = function(id, type, callback) {
  
  var Annotation = getAnnotationModel(type);

  Annotation.findOne({_id: id}, function(err, annotation) {
    if (err) {
      return callback(err);
    }

    if (annotation) {
      annotation.remove(function(err) {
        if (err) {
          return callback(err);
        }
        callback();
      });
    } else {
      var err = {
        status: 500, 
        name: "Bad input", 
        message: "Unable to find the annotation with the given id"
      }
      return callback(err);
    }
  });
}