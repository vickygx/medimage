var medImageApp = angular.module('medImageApp');

medImageApp.controller('gridController', function($scope, gridService) {

  //////////////////////////// Scope Variables
  $scope.viewModel = {
    images: gridService.images
  }

  // Updator function for images variables changing
  $scope.$on('images.update', function( event ) {
    $scope.viewModel.images = gridService.images;
    $scope.$apply();
    helpers.updateViewImages();
  });

  // Updator function for error variable changing
  $scope.$on('images.error', function( event) {
    helpers.updateError();
  });

  //////////////////////////// Helpers
  var helpers = (function() { 

    var updateError = function(){
      $('.grid .error').html(gridService.error);
    }

    var displayAllImages = function(){
      gridService.displayAllImages();
    }

    var updateViewImages = function(){
      resizeImages();
    }
    /** 
      Resizes the images to fit in the displayed box
      Only shows the most while keeping the aspect ratio
    **/
    var resizeImages = function(){
      $('.gridItem .image img').each(function(i){

        var img = $(this)[0];

        img.onload = function() {
          var css = calcImgMaxOrMin(img, false, 1);
          $(this).css('width', "auto");
          $(this).css('height', "auto");
          $(this).css(css.cssProp, "100%");
        }
        
      });
      
    }

    /** Returns an object with:
     *  - cssProp: The max or min of the width and the height of the image
     *  - cssVal: The value of the default width if cssProp = width
     *            or height if cssProp = height
     *  @param {DOM img} img: a DOM image element
     *  @param {boolean} maxOrMin: false if you want to use min,
     *                   defaults to true
     *  @param {float/int} mult: optional multiplier to thisHeight
     *                           defaults to 1
     */
    var calcImgMaxOrMin = function(img, maxOrMin, mult) {
      maxOrMin = (maxOrMin === undefined) ? true : maxOrMin;
      mult = (mult === undefined) ? 1 : mult;
      var thisHeight = img.naturalHeight * mult;
      var thisWidth = img.naturalWidth;
      var heightOrWidthArray = ['height', 'width'];
      var heightOrWidth = maxOrMin ? Math.max(thisHeight, thisWidth) : Math.min(thisHeight, thisWidth);
      var cssProp, cssVal;
      if (heightOrWidth == thisHeight) {
        cssProp = heightOrWidthArray[0];
        cssVal = thisWidth;
      } else {
        cssProp = heightOrWidthArray[1];
        cssVal = thisHeight;
      }
      return {
        cssProp: cssProp,
        cssVal: cssVal
      }
    }

    return {
      displayAllImages: displayAllImages,
      updateViewImages: updateViewImages,
      updateError : updateError
    }
  })();

  var init = (function() {
    helpers.displayAllImages();
    eventHandlers();
  })();

  function eventHandlers() {
  }
});

