/*  Represents the a photo canvas editor
* 
*   @author: Danny Sanchez
*/

var EditorImg = (function() {

  var EditorImg = function(img, coord, zoom, ctx, canvas) {
    this.img = img;
    this.coord = coord;
    this.zoom = zoom;
    this.ctx = ctx;
    this.canvas = canvas;
  }

  EditorImg.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    var imgWidth = this.img.width * this.zoom;
    var imgHeight = this.img.height * this.zoom;
    this.ctx.drawImage(this.img, this.coord.x, this.coord.y, imgWidth, imgHeight);
  }

  EditorImg.prototype.move = function(e, prev_e_coord) {
    this.coord = this.coord.add(getEventCoord(e).subtract(prev_e_coord))
  }

  EditorImg.prototype.zoomIn = function(amount) {
    this.zoom += (this.zoom * amount);
    this.draw();
  }

  EditorImg.prototype.zoomOut = function(amount) {
    this.zoom -= (this.zoom * amount);
    this.draw();
  }

  EditorImg.prototype.toImgCoord = function(canvasCoord) {
    return canvasCoord.subtract(this.coord).scaldiv(this.zoom);
  }

  EditorImg.prototype.toCanvasCoord = function(imgCoord) {
    return this.coord.add(imgCoord.scalmult(this.zoom));
  }

  return EditorImg;

})();