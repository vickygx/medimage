/*  gridController
*
*   Angular Controller for grid mixin
*     Takes care of the view for the grid mixin while getting updates from gridService
*     for data updates.
*
*   Dependencies: gridService
* 
*   @author: Vicky Gong
*/

var medImageApp = angular.module('medImageApp');

medImageApp.controller('gridController', function($scope, gridService) {

  //////////////////////////// Scope Variables
  var public = $scope.viewModel = {
    images: gridService.images,
    isUserPage: gridService.isUserPage
  }

  /* Updator function for images variables changing
  */
  $scope.$on('images.update', function( event ) {
    $scope.viewModel.images = gridService.images;
    $scope.viewModel.isUserPage = gridService.isUserPage;

    $scope.$apply();
    helpers.updateViewImages();
  });

  /* Updator function for error variable changing
  */
  $scope.$on('images.error', function( event) {
    helpers.updateError();
  });

  //////////////////////////// Helpers
  var helpers = (function() { 

    /* Updates the error box
    */
    var updateError = function(){
      $('.grid .error').html(gridService.error);
    }

    /* Displays all images
    */
    var displayAllImages = function(){
      gridService.displayAllImages();
    }

    /* Updates the view
    */
    var updateViewImages = function(){
      resizeImages();

      // Update add and upload event handlers
      if ($scope.viewModel.isUserPage){
        addImageEventHandlers();
      }
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

  /* Initializer function 
  */
  var init = (function() {
    helpers.displayAllImages();
  })();

  /* Function that adds all the event handlers associated with adding image
  */
  function addImageEventHandlers() {
    // Click handler for adding image 
    $('#addGridImage').unbind('click');
    $('#addGridImage').click(function(e){
      $(e.currentTarget.parentElement).find('input[name="medImage"]').click();
    });


    // Handler for submit
    $('#uploadImageForm').unbind('submit');
    $('#uploadImageForm').on("submit", function(e){
      e.preventDefault();
      var formData = new FormData($(this)[0]);

      // Upload image
      $.ajax({
        url: "/medimages",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
      }).success(function(res){
        $('#uploadImageForm')[0].reset();
      }).always(function(res) {
        gridService.displayUserImages();
      });
    });
  }
});

