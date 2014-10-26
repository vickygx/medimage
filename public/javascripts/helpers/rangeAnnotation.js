var RangeAnnotation = (function() {

  var RangeAnnotation = function(text, startCoord, endCoord, ctx, img) {

    // Pass inheritance variables (Allows use of Annotation methods)
    Annotation.call(this, text);

    this.startCoord = startCoord;
    this.endCoord = endCoord;
    this.rectangle = new Rectangle(startCoord, endCoord);    

    this.ctx = ctx;
    this.img = img;
  }

  // Inherit Annotation
  RangeAnnotation.prototype = Object.create(new Annotation());

  RangeAnnotation.prototype.moveEnd = function(e, prev_e_coord, img) {
    this.endCoord = this.endCoord.add(getEventCoord(e).subtract(prev_e_coord)
                                                      .scaldiv(img.zoom));
    this.rectangle.moveEnd(e, prev_e_coord, img);
  }

  RangeAnnotation.prototype.move = function(e, prev_e_coord, img) {
    this.startCoord = this.startCoord.add(getEventCoord(e).subtract(prev_e_coord)
                                                          .scaldiv(img.zoom));
    this.moveEnd(e, prev_e_coord, img);

    this.rectangle.move(e, prev_e_coord, img);
  }

  RangeAnnotation.prototype.draw = function() {
    this.rectangle.draw(this.ctx, this.img);
  }

  return RangeAnnotation;

})();

