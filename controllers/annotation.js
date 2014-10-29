/*  All the functions related to manipulating and retrieving information 
    from the Annotation database

    @author: Danny Sanchez
*/

var PointAnnotation = require('../data/models/annotation/pointAnnotation');
var RangeAnnotation = require('../data/models/annotation/rangeAnnotation');

var errors = require('../errors/errors');

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
 * Get annotation by ID
 */
module.exports.getAnnotationByID = function(annoID, type, callback) {

  var Annotation = getAnnotationModel(type);

  Annotation.findById(annoID, callback);
}

/**
 * Gets all annotations for the medical image with the given image id
 * @param {ObjectId} imageId: _id of MedImage to get annotations from
 * @param {Function} callback: function to call after annotations 
 *   successfully gathered, or in case of error.  Found annotations
 *   are passed into this function
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
 * Creates an annotation of the given type, with the info passed in data
 * @param {String} type: "point" || "range", type of annotation to create
 * @param {JSON} data: information to create annotation from
 * @param {Function} callback: function to call after annotation is created
 */
module.exports.createAnnotation = function(type, data, callback) {
  
  var Annotation = getAnnotationModel(type);

  Annotation.create(data, function(err, annotation) {
    if (err) {
      return callback(err);
    }

    callback(null, annotation);
  });
}

/**
 * Updates the annotation with the given id of the given type with 
 * the given data
 * @param {ObjectId} id: _id of annotation to update
 * @param {String} type: "point" || "range", type of annotation to update
 * @param {JSON} data: info to update annotation with
 * @param {Function} callback: function to call after annotation is updated
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
      return callback(errors.annotations.notFound);
    }
  });
}

/**
 * Deletes the annotation with the given id of the given type
 * @param {ObjectId} id: _id of annotation to delete
 * @param {String} type: "point" || "range", type of annotation to delete 
 * @param {Function} callback: function to call after annotation is deleted
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
      return callback(errors.annotations.notFound);
    }
  });
}

/**
 * Delete all annotations associated with an image
 *
 * @param {ObjectID} imageID - id of image
 * @param {Function} callback - callback called after deleting all objects
 */
 module.exports.deleteAnnotationsForImage = function(imageID, callback) {
  PointAnnotation.remove({ image_id: imageID }, function(err) {
    if (err) {
      callback(err);
    }

    RangeAnnotation.remove({ image_id: imageID }, callback);
  });
}