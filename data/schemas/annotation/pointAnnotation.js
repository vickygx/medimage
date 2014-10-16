var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');

var AnnotationSchema = require('./annotation');

//

var PointAnnotationSchema = AnnotationSchema.extend({
  startPoint: {x: Number, y: Number}
});

module.exports = PointAnnotationSchema;