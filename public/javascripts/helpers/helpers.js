var getEventCoord = function(e) {
      
  var currentX, currentY;

  if(e.offsetX !== undefined){
    currentX = e.offsetX;
    currentY = e.offsetY;
  } else { // Firefox compatibility
    currentX = e.layerX - e.currentTarget.offsetLeft;
    currentY = e.layerY - e.currentTarget.offsetTop;
  }

  return new Coord(currentX,currentY);
}