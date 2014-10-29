medImageApp = angular.module('medImageApp');

medImageApp.service('gridService', ['$rootScope', function($rootScope) {
  
  var helpers = (function(){
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

    return {
      combineImageAndTagHash: combineImageAndTagHash,
      combineSortedImageAndImageHash: combineSortedImageAndImageHash,
    }

  })();

  var service =  {
  
    images: [],
    error: 'All is good!',
    isUserPage: false,
    
    // Function to display searched images
    displaySearchedImages: function(tagQuery){
      ajaxController.get("/search/tags?" + tagQuery)
        .success(function(res) {
          service.isUserPage = false;
          service.images = helpers.combineSortedImageAndImageHash(res.images , res.imageIdToImage);        
          $rootScope.$broadcast( 'images.update' );
        })
        .error(function(res){
          service.error = res.responseText ? res.responseText : 'error';
          $rootScope.$broadcast( 'images.error' );
        });

    },

    // Function to display all images
    displayAllImages: function(){
      ajaxController.get("/medimages?tag=true")
        .success(function(res) {
          service.isUserPage = false;
          service.images = helpers.combineImageAndTagHash(res.images, res.imageIdToTags);
          $rootScope.$broadcast( 'images.update' );
        })
        .error(function(res){
          service.error = res.responseText ? res.responseText : 'error';
          $rootScope.$broadcast( 'images.error' );
      });
    },

    // Function to display user images
    displayUserImages: function(){
      ajaxController.get("/users/" + $rootScope.user + "/medimages?tag=true")
        .success(function(res) {
          service.isUserPage = true;
          service.images = helpers.combineImageAndTagHash(res.images , res.imageIdToTags);
          $rootScope.$broadcast( 'images.update' );
        })
        .error(function(res){
          service.error = res.responseText ? res.responseText : 'error';
          $rootScope.$broadcast( 'images.error' );
      });
    },

    // Clears the images
    clearImages: function(){
      service.isUserPage = false;
      service.images = [];
      $rootScope.$broadcast( 'images.update' );
    },

    setEditing: function(editing) {
      $rootScope.editing = editing;
      $rootScope.$apply();
    }
  }
  
  return service;

}]);

/*  Directive to get searched images through a form
    The div that contains this directive must have an input with name="tags" 
*/
medImageApp.directive('getSearchedImagesForm', ['gridService', function(gridService){
  return {
    restrict: "C", 
    link: function(scope, element, attrs) {
      element.bind("click", function(e){
        var tags = $(e.currentTarget.parentElement).find('input[name="tags"]').val().split(',');
        var tagQuery = '';
        for (var i = 0; i < tags.length ; i++){
          tagQuery += 'tag=' + tags[i].trim() + '&';
        }
        gridService.displaySearchedImages(tagQuery);
      });
    }
  }
}]);

/*  Directive to display searched images 
    Requirements: innerHTML of object with directive contains the tag name 
*/
medImageApp.directive('displaySearchedImages', ['gridService', function(gridService){
  return {
    restrict: "C", 
    link: function(scope, element, attrs) {

      element.bind("click", function(e){
        var tag = e.currentTarget.innerHTML;
        gridService.setEditing(false);
        gridService.displaySearchedImages("tag=" + tag);
      });
    }
  }
}]);

/*  Directive to display images of session user 
*/
medImageApp.directive('displayUserImages', ['gridService', function(gridService){
  return {
    restrict: "C", 
    link: function(scope, element, attrs) {

      element.bind("click", function(e){
        gridService.setEditing(false);
        gridService.displayUserImages();
      });
    }
  }
}]);

/*  Directive to display all images 
*/
medImageApp.directive('displayAllImages', ['gridService', function(gridService){
  return {
    restrict: "C", 
    link: function(scope, element, attrs) {

      element.bind("click", function(e){
        gridService.setEditing(false);
        gridService.displayAllImages();
      });
    }
  }
}]);

/*  Directive to clear all iamges from display 
*/
medImageApp.directive('clearImages', ['gridService', function(gridService){
  return {
    restrict: "C", 
    link: function(scope, element, attrs) {

      element.bind("click", function(e){
        gridService.clearImages();
      });
    }
  }
}]);

