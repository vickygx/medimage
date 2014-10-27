var RangeAnnotation = (function() {

  var RangeAnnotation = function(text, startCoord, endCoord, ctx, img, image_id, _id) {

    // Pass inheritance variables (Allows use of Annotation methods)
    Annotation.call(this, text);

    this.startCoord = startCoord;
    this.endCoord = endCoord;
    this.rectangle = new Rectangle(startCoord, endCoord);    

    this.ctx = ctx;
    this.img = img;
    this.image_id = image_id;

    this.id = _id;
    this.mutex = $.Deferred();
    this.mutex.resolve();
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
    
    this.endCoord = this.endCoord.add(getEventCoord(e).subtract(prev_e_coord)
                                                      .scaldiv(img.zoom));

    this.rectangle.move(e, prev_e_coord, img);
  }

  RangeAnnotation.prototype.draw = function() {
    this.rectangle.draw(this.ctx, this.img);
  }

  RangeAnnotation.prototype.submit = function() {
    var data = {
      text: this.text, 
      image_id: this.image_id, 
      type: "range", 
      start_x: this.startCoord.x, 
      start_y: this.startCoord.y, 
      end_x: this.endCoord.x,
      end_y: this.endCoord.y
    }

    if (this.inDB()) {
      
      ajaxController.put('/annotations/' + this.id, data).fail(function(e) {
        alert("Error: " + e.responseText);
      });
    } else {
      this.mutex = $.Deferred();

      var that = this;
      ajaxController.post('/annotations', data).done(function(res) {
        that.id = res._id;
        that.mutex.resolve();
      }).fail(function(e) {
        alert("Error: " + e.responseText);
        that.mutex.resolve();
      });
    }
  }

  RangeAnnotation.prototype.del = function() {
    var data = {
      type: "range"
    }

    ajaxController.del('/annotations/' + this.id, data).fail(function(e) {
      alert("Error: " + e.responseText);
    });
  }

  RangeAnnotation.prototype.inDB = function() {
    return (this.id !== undefined);
  }

  return RangeAnnotation;

})();

