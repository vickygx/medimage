var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	first_name: String, 
	last_name: String,
	username: String,
	password: String;
});

module.exports = UserSchema;