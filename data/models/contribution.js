var mongoose = require('mongoose');
var ContributionSchema = require('../schemas/contribution');

var Contribution = mongoose.model('Contribution', ContributionSchema);

module.exports = Contribution;
