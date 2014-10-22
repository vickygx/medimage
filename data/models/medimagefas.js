var mongoose = require('mongoose');
var MedImageSchema = require('../schemas/medimage');

var MedImage = mongoose.model('MedImage', MedImageSchema);

module.exports = MedImage;
