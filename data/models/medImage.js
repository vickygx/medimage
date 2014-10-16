var mongoose = require('mongoose');
var MedImageSchema = require('../schemas/medImage');

var MedImage = mongoose.model('MedImage', MedImageSchema);
