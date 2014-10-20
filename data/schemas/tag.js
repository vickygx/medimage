var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
	_image: {type: mongoose.Schema.Types.ObjectId, ref: 'MedImage'},
	tag_name: String
});

module.exports = TagSchema;