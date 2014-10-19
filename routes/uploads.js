module.exports = function(app) {
  var ObjectId = require('mongoose').Types.ObjectId;
  var MedImage = require('../data/models/medimage');
  var path = require('path');

  app.get('/uploads/images/:user_id/:image_name', function(req, res) {
    var userID = req.params.user_id;
    var imageName = req.params.image_name;

    //Check if objectId or imageName is valid
    var indexOfPNG = imageName.indexOf(".png");
    var indexOfJPG = imageName.indexOf(".jpg");
    var correctIndex = imageName.length - 4;
    if (!ObjectId.isValid(userID) || (indexOfPNG !== correctIndex && indexOfJPG !== correctIndex)) {
      res.json(400, "Invalid URL Syntax");
    }

    //See if image exists, display it if so
    MedImage.findOne({ image_url: req.path }, function(err, image) {
      if (err) {
        res.render(err);
        return;
      }
      if (!image) {
        res.json(404, "Image not found");
      } else {
        var envFolder = (app.settings.env === "development") ? "local" : "prod";
        var imagePath = "./public/" + envFolder + "/uploads/" + userID + "/" + imageName;
        res.sendfile(path.resolve(imagePath));
      }
    });
  });
};