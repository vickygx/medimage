/*  Represents a coordinate in space
* 
*   @author: Danny Sanchez
*/

var Coord = (function() {

  var Coord = function(x, y) {
    this.x = x;
    this.y = y;
  }

  Coord.prototype.add = function(addCoord) {
    return new Coord(this.x + addCoord.x, this.y + addCoord.y);
  }

  Coord.prototype.subtract = function(subCoord) {
    return new Coord(this.x - subCoord.x, this.y - subCoord.y);
  }

  Coord.prototype.scalmult = function(scalar) {
    return new Coord((this.x * scalar),
                     (this.y * scalar));
  }

  Coord.prototype.scaldiv = function(scalar)  {
    return new Coord((this.x / scalar),
                     (this.y / scalar));
  }

  return Coord;

})();