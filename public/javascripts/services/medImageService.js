medImageApp = angular.module('medImageApp');

medImageApp.service('medImageService', function() {

  var helpers = (function(){
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

    return {
      calcImgMaxOrMin: calcImgMaxOrMin
    }
  })();

  // Define shared methods
  function displayUserImages(scope){
    // TODO: check if grid exists
    ajaxController.get("/users/" + scope.user + "/medimages?tag=true")
      .success(function(res) {
        var images = combineImageAndTagHash(res.images , res.imageIdToTags);

        scope.viewModel.images = images;
        scope.$apply();
        resizeImages();
      })
      .error(function(res){
        //TODO
        console.log('error');
      });
  }

  function displaySearchedImages(scope, tagQuery){
    ajaxController.get("/search/tags?" + tagQuery)
      .success(function(res) {
        var images = combineSortedImageAndImageHash(res.images , res.imageIdToImage);

        scope.viewModel.images = images;
        scope.$apply();
        resizeImages();
        
      })
      .error(function(res){
        //TODO
        console.log('error');
      });
  }


  function displayAllImages(scope){
    // TODO: check if grid exists
    ajaxController.get("/medimages?tag=true")
      .success(function(res) {
        var images = combineImageAndTagHash(res.images, res.imageIdToTags);
        
        scope.viewModel.images = images;
        scope.$apply();
        resizeImages();
      })
      .error(function(res){
        //TODO
        console.log('error');
      });
  }

  function resizeImages(){
    $('.gridItem .image img').each(function(i){

      var img = $(this)[0];

      img.onload = function() {
        var css = helpers.calcImgMaxOrMin(img, false, 1);
        $(this).css(css.cssProp, "100%");
      }
      
    });
    
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
        key: <mongo id for med image>
        value: 
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
  function combineSortedImageAndImageHash(sortedPhotos, imageIdToImage){
    var result = [];
    var imageId, imageObject, image;
    for (var i = 0; i < sortedPhotos.length; i++){
      imageId = sortedPhotos[i]._id;
      imageObject = imageIdToImage[imageId];
      image = {
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

  /**
    Input: 
      photos are formatted such:
      {
        _id: <mongo id for med image>
        creator: 
        title: 
        image_url:
      }
      imageIdToTag are formatted such:
      {
        key: <mongo id for med image>
        value: <list of tags (Strings)>
      }
    Resulting format:
    { _id: <mongo id for med image>
      image_url: <url for image>
      title: <title of image>
      tags: <array of strings that are tag names>
    }
  **/
  function combineImageAndTagHash(photos, imageIdToTag){
    var result = [];
    var imageId, imageObject, image;
    for (var i = 0; i < photos.length; i++){
      imageId = photos[i]._id;
      tagsList = imageIdToTag[imageId];
      image = {
        _id: imageId,
        image_url: photos[i].image_url,
        title: photos[i].title,
        tags: tagsList ? tagsList : [],
      }
      result.push(image);
    }
    return result;
  }

  // Share the methods
  return {
    displayUserImages: displayUserImages,
    displaySearchedImages: displaySearchedImages,
    displayAllImages: displayAllImages
  }
});