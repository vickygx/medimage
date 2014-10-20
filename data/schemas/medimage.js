var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var MedImageSchema = new mongoose.Schema({
  _creator: { type: ObjectId, ref: 'User'},
  title: String,
	image_url: String
});

module.exports = MedImageSchema;