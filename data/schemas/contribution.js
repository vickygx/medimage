var mongoose = require('mongoose');

var ContributionSchema = new mongoose.Schema({
	image_id: Number, 
	user_id: Number;
});

module.exports = ContributionSchema;