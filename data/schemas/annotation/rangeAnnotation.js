var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');

var AnnotationSchema = require('./annotation');

//

var RangeAnnotationSchema = AnnotationSchema.extend({
  startPoint: {x: Number, y: Number}, 
  endPoint: {x: Number, y: Number}
});

module.exports = RangeAnnotationSchema;