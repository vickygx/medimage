var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var AnnotationSchema = new mongoose.Schema({
  text: String, 
  image_id: ObjectId
});

module.exports = AnnotationSchema;