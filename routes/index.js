
var express = require('express');
var router = express.Router();


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

// Gets the medical image
router.get('/medimage/:id', function(req, res) {

});

// Get all the annotations of this medical image
router.get('/medimage/:id/annotation', function(req, res) {

});

// Get all the tags of this medical image
router.get('/medimage/:id/tag', function(req, res) {

});

//  Get all the photos that have these tags
router.get('/search?tag=<item>&<item>', function(req, res) {

});

// Get all the tags of this medical image
router.get('/user/access?id=<imageid>', function(req, res) {

});

// TODO: editing, deleting and creating annotations + tags
// TODO: creating, deleting images
// TODO: adding people as collaborators
// TODO: removing people as collaborators 



// Get all the tags of this medical image
router.get('', function(req, res) {

});

