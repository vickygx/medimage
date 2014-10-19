var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
	image_id: Number, 
	tag_name: String
});

module.exports = TagSchema;