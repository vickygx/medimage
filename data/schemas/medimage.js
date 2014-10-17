var mongoose = require('mongoose');

var MedImageSchema = new mongoose.Schema({
	image_url: String
});

module.exports = MedImageSchema;