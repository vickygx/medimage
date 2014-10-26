function Coord(x,y) {
  this.x = x;
  this.y = y;

  this.add = function(addCoord) {
    return new Coord(this.x + addCoord.x, this.y + addCoord.y);
  }

  this.subtract = function(subCoord) {
    return new Coord(this.x - subCoord.x, this.y - subCoord.y);
  }

  this.scalmult = function(scalar) {
    return new Coord(Math.round(this.x*scalar),
                     Math.round(this.y*scalar));
  }

  this.scaldiv = function(scalar)  {
    return new Coord(Math.round(this.x/scalar),
                     Math.round(this.y/scalar));
  }
}