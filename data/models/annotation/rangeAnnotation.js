var mongoose = require('mongoose');
var RangeAnnotationSchema = require('../../schemas/annotation/rangeAnnotation');

var RangeAnnotation = mongoose.model('RangeAnnotation', RangeAnnotationSchema);

module.exports = RangeAnnotation;