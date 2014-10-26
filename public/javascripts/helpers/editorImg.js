function EditorImg(img, coord, zoom, ctx, canvas, helpers) {
  this.img = img;
  this.coord = coord;
  this.zoom = zoom;
  this.ctx = ctx;
  this.canvas = canvas;
  this.helpers = helpers;

  this.draw = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    var imgWidth = this.img.width * this.zoom;
    var imgHeight = this.img.height * this.zoom;
    this.ctx.drawImage(this.img, this.coord.x, this.coord.y, imgWidth, imgHeight);
  }

  this.move = function(e, prev_e_coord) {
    this.coord = this.coord.add(helpers.getEventCoord(e).subtract(prev_e_coord))
  }

  this.zoomIn = function(amount) {
    this.zoom += (this.zoom * amount);
    this.draw();
  }

  this.zoomOut = function(amount) {
    this.zoom -= (this.zoom * amount);
    this.draw();
  }
}