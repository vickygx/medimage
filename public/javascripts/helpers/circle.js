var Circle = (function() {

  var Circle = function(coord, radius) {
    this.coord = coord;
    this.radius = radius;
  }

  Circle.prototype.move = function(e, prev_e_coord, img) {
    this.coord = this.coord.add(getEventCoord(e).subtract(prev_e_coord)
                                                .scaldiv(img.zoom));
  }

  Circle.prototype.draw = function(ctx, img) {
    var canvasCoord = img.toCanvasCoord(this.coord);
    ctx.beginPath();
    ctx.arc(canvasCoord.x, canvasCoord.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "rgba(255, 128, 0, 0.2)";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "orangered";
    ctx.stroke();
  }

  return Circle;

})();