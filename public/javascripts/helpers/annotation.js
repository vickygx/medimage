var Annotation = (function() {

  var Annotation = function(text) {
    this.text = text;
  }

  Annotation.prototype.setText = function(text) {
    this.text = text;
  }

  return Annotation;

})();