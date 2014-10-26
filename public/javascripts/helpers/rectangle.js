var Rectangle = (function() {

  var Rectangle = function(startCoord, endCoord) {
    this.startCoord = startCoord;
    this.endCoord = endCoord;
  }

  Rectangle.prototype.moveEnd = function(e, prev_e_coord, img) {
    this.endCoord = this.endCoord.add(getEventCoord(e).subtract(prev_e_coord)
                                                      .scaldiv(img.zoom));
  }

  Rectangle.prototype.move = function(e, prev_e_coord, img) {
    this.startCoord = this.startCoord.add(getEventCoord(e).subtract(prev_e_coord)
                                                          .scaldiv(img.zoom));

    this.moveEnd(e, prev_e_coord, img);
  }

  Rectangle.prototype.draw = function(ctx, img) {
    var startCanvasCoord = img.toCanvasCoord(this.startCoord);
    var endCanvasCoord = img.toCanvasCoord(this.endCoord);
    var width = endCanvasCoord.x - startCanvasCoord.x;
    var height = endCanvasCoord.y - startCanvasCoord.y;

    ctx.beginPath();
    ctx.rect(startCanvasCoord.x, startCanvasCoord.y, width, height);
    ctx.fillStyle = "rgba(0, 128, 255, 0.2)";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#2671B6";
    ctx.stroke();
  }

  return Rectangle;

})();