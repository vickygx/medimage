var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');

var AnnotationSchema = require('./annotation');

//

var RangeAnnotationSchema = AnnotationSchema.extend({
  start_point: {x: Number, y: Number}, 
  end_point: {x: Number, y: Number}
});

module.exports = RangeAnnotationSchema;