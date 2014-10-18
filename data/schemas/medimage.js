var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var MedImageSchema = new mongoose.Schema({
  user_id: ObjectId,
	image_url: String
});

module.exports = MedImageSchema;