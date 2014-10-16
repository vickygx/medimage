
module.exports = function(app){


  // Creates a medical image
  app.post('/medimages', function(req, res){
    var fileType = req.files.medImage.type;

    if (fileType === "image/jpeg" || fileType === "image/png") {
      //TODO: differentiated between development and production
      res.json({
        fileType: fileType
      });
    } else {
      res.send(400, "Invalid File Type: file must be a PNG or JPEG");
    }
  });

  // Deletes a medical image
  app.del('/medimages/:id', function(req, res){

  });

  // Gets the medical image with the given id
  app.get('/medimages/:id', function(req, res) {

  });

};