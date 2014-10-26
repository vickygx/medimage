var PointAnnotation = (function() {

  var PointAnnotation = function(text, coord, ctx, img, image_id, radius) {
    
    // Pass inheritance variables (Allows use of Annotation methods)
    Annotation.call(this, text);

    this.coord = coord;
    this.circle = new Circle(coord, radius);

    this.ctx = ctx;
    this.img = img;
    this.image_id = image_id;
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

    ajaxController.post('/annotations', data).fail(function(e) {
      alert("Error:" + JSON.stringify(e));
    });
  }

  return PointAnnotation;

})();

