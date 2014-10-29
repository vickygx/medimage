/*  Represents annotation
* 
*   @author: Danny Sanchez
*/

var Annotation = (function() {

  var Annotation = function(text) {
    this.text = text;
  }

  Annotation.prototype.setText = function(text) {
    this.text = text;
  }

  return Annotation;

})();