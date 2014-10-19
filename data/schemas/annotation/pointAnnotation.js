var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');

var AnnotationSchema = require('./annotation');

//

var PointAnnotationSchema = AnnotationSchema.extend({
  start_point: {x: Number, y: Number}
});

module.exports = PointAnnotationSchema;