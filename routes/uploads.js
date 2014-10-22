//Node Dependency Modules
var path = require('path');

//Controller Modules
var ObjectId = require('mongoose').Types.ObjectId;
var MedImage = require('../data/models/medimage');

//Error Modules
var ErrorChecking = require('../errors/errorChecking');
var Errors = require('../errors/errors');

module.exports = function(app) {

  app.get('/uploads/images/:username/:image_name', function(req, res, next) {
    var username = req.params.username;
    var imageName = req.params.image_name;

    //Check if objectId or imageName is valid
    if (ErrorChecking.uploads.invalidImageRequest(imageName)) {
      return next(Errors.uploads.invalidImageRequestError);
    }

    //See if image exists, display it if so
    MedImage.findOne({ image_url: req.path }, function(err, image) {
      if (err) {
        return next(err);
      }
      if (!image) {
        return next(Errors.uploads.imageNotFoundError);
      } 
      if (ErrorChecking.invalidAppEnv(app.settings.env)) {
        return next(Errors.invalidAppEnvError);
      }

      var envFolder = (app.settings.env === "production") ? "prod" : "local";
      var imagePath = "./public/" + envFolder + "/uploads/" + username + "/" + imageName;
      res.sendfile(path.resolve(imagePath));
    });
  });
};