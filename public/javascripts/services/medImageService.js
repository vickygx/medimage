medImageApp = angular.module('medImageApp');

medImageApp.service('medImageService', function() {

  // Define shared methods
  function displayUserImages(scope){
    // TODO: check if grid exists
    ajaxController.get("/users/" + scope.user + "/medimages")
      .success(function(res) {
        scope.viewModel.images = res;
        scope.$apply();
      })
      .error(function(res){
        //TODO
        console.log('error');
      });
  }

  function displaySearchedImages(scope, tagQuery){
    ajaxController.get("/search/tags?" + tagQuery)
      .success(function(res) {
        var images = turnToGridFormat(res.photos , res.imageIdToImage)

        scope.viewModel.images = images;
        scope.$apply();
      })
      .error(function(res){
        //TODO
        console.log('error');
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
  function calcImgMaxOrMin(img, maxOrMin, mult) {
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

  function displayAllImages(scope){

  }

  /**
    Input: 
      sortedPhotos are formatted such:
      {
        _id: <mongo id for med image>
        count: <# of tags matched>
        tags: <list of tags matched>
      }
      imagesIdToImage are formatted such:
      {
        _id:
        _creator:
        title:
        image_url:
      }
    Resulting format:
    { _id: <mongo id for med image>
      image_url: <url for image>
      title: <title of image>
      tags: <array of strings that are tag names>
      [count]: <number of matched tags> }
  **/
  function turnToGridFormat(sortedPhotos, imagesIdToImage){
    debugger;
    var result = [];
    for (var i = 0; i < sortedPhotos.length; i++){
      var imageId = sortedPhotos[i]._id;
      var imageObject = imagesIdToImage[imageId];
      var image = {
        _id: imageId,
        image_url: imageObject.image_url,
        title: imageObject.title,
        tags: sortedPhotos[i].tags,
        count: sortedPhotos[i].count
      }

      result.push(image);

    }

    return result;
  }


  // Share the methods
  return {
    displayUserImages: displayUserImages,
    displaySearchedImages: displaySearchedImages
  }
});