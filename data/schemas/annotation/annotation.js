var mongoose = require('mongoose');

var AnnotationSchema = new mongoose.Schema({
  text: String, 
  image_id: String
});

module.exports = AnnotationSchema;