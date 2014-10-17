
module.exports = function(app){

  // Get all the annotations of the medical image
  // with the given id
  app.get('/annotation/:imageId', function(req, res) {
    res.end("GET request made to: " + req.url);
  });

  // Create a new annotation
  app.post('/annotation', function(req, res) {
    res.end("POST request made to: " + req.url + " with data: " + JSON.stringify(req.body));
  });

  // Edit an existing annotation
  app.put('/annotation', function(req, res) {
    res.end("PUT request made to: " + req.url + " with data: " + JSON.stringify(req.body));
  });

  // Delete an annotation
  app.del('/annotation', function(req, res) {
    res.end("DELETE request made to: " + req.url + " with data: " + JSON.stringify(req.body));
  });

};