module.exports = function(app){
  var fs = require('fs');

  // Creates a medical image
  app.post('/medimages', function(req, res){
    //check file type
    var fileType = req.files.medImage.type;
    if (fileType !== "image/jpeg" && fileType !== "image/png") {
      //ERROR: wrong file type
      res.send(400, "Invalid File Type: file must be a PNG or JPEG");
      return;
    }

    //check app environment
    if (app.settings.env !== "development" && app.settings.env !== "production") {
      //ERROR: unknown environment
      res.send(500, "Server Error: Invalid app environment");
      return;
    }

    //build upload path
    //TODO get real userID when we can
    var userID = 0;

    var fileName = req.files.medImage.name;
    fileName = fileName.replace(/\s+/g, '').slice(0, 10).toLowerCase();

    var date = Date.now();

    var uploadFolder = __dirname;
    if (app.settings.env === "development") {
      uploadPath += "/../public/local";
    } else {
      uploadPath += "/../public/prod";
    }
    uploadFolder += "/uploads/" + userID;

    fs.exists(uploadFolder, function(exists) {
      if (!exists) {
        fs.mkdir(uploadFolder, function(err) {
          if (err) {
            res.json(500, err);
            return;
          }
        });
      } else {
        //TODO upload
      }
    });

    // fs.readFile(req.files.medImage.path, function(err, data) {
    //   fs.writeFile(uploadPath, data, function (err) {
    //     if (err) {
    //       res.json(500, err);
    //       return;
    //     }

    //     res.json({
    //       uploadPath: uploadPath
    //     });

    //     //TODO: update database with new medImage
    //   });
    // });
  });

  // Deletes a medical image
  app.del('/medimages/:id', function(req, res){

  });

  // Gets the medical image with the given id
  app.get('/medimages/:id', function(req, res) {

  });

};