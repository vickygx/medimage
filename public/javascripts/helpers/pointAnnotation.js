var PointAnnotation = (function() {

  var PointAnnotation = function(text, coord, ctx, img, image_id, radius, _id) {

    // Pass inheritance variables (Allows use of Annotation methods)
    Annotation.call(this, text);

    this.coord = coord;
    this.circle = new Circle(coord, radius);

    this.ctx = ctx;
    this.img = img;
    this.image_id = image_id;

    this.id = _id;
  }

  // Inherit Annotation
  PointAnnotation.prototype = Object.create(new Annotation());

  PointAnnotation.prototype.move = function(e, prev_e_coord, img) {
    this.coord = this.coord.add(getEventCoord(e).subtract(prev_e_coord)
                                                .scaldiv(img.zoom));
    this.circle.move(e, prev_e_coord, img);
  }

  PointAnnotation.prototype.draw = function() {
    this.circle.draw(this.ctx, this.img);
  }

  PointAnnotation.prototype.submit = function() {
    var data = {
      text: this.text, 
      image_id: this.image_id, 
      type: "point", 
      start_x: this.coord.x, 
      start_y: this.coord.y
    }

    if (this.inDB()) {
      ajaxController.put('/annotations/' + this.id, data).fail(function(e) {
        alert("Error :" + JSON.stringify(e));
      });
    } else {
      ajaxController.post('/annotations/', data).done(function(res) {
        this.id = res._id;
      }).fail(function(e) {
        alert("Error :" + e.responseText);
      });
    }
  }

  PointAnnotation.prototype.del = function() {
    var data = {
      type: "point"
    }

    ajaxController.del('/annotations/' + this.id, data).fail(function(e) {
      alert("Error: " + e.responseText);
    });
  }

  PointAnnotation.prototype.inDB = function() {
    return (this.id !== undefined);
  }

  return PointAnnotation;

})();

