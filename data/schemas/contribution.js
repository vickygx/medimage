var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ContributionSchema = new mongoose.Schema({
	image_id: ObjectId, 
	user_id: ObjectId
});

module.exports = ContributionSchema;