var mongoose = require('mongoose');
var PointAnnotationSchema = require('../../schemas/annotation/pointAnnotation');

var PointAnnotation = mongoose.model('PointAnnotation', PointAnnotationSchema);

module.exports = PointAnnotation;