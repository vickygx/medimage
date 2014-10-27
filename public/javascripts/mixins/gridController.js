var medImageApp = angular.module('medImageApp');

medImageApp.controller('gridController', function($scope, medImageService) {

  // Public /////////////////////////////////////////////////////////

  var public = $scope.viewModel = {
    images: [{id: 'Vicky', image_url: 'www.google.com/', title: 'Vicky Title', tags: ['what']}]
  }


  // Private ////////////////////////////////////////////////////////

  var private = (function() {
    return {

    }
  })();

  var helpers = (function() {

    function setAllImages(){
      medImageService.method($scope) 
    }

    function setUserImages(){
       ajaxController.get("/users/" + $scope.user + "/medimages")
        .success(function(res) {
          setImages(JSON.stringify(res));
        })
        .error(function(res){
          console.log('error');
        });
    }

    function setSearchedImages(tags){

    }

    function setImages(images){
      public.images = images;
      $scope.$apply();
    }
 
    function sizingJS() {}

    function responsiveJS() {
      sizingJS();
    }

    return {
      sizingJS: sizingJS, 
      responsiveJS: responsiveJS,
      setImages: setImages
    }
  })();

  var init = (function() {
    
    helpers.sizingJS();
    $(window).resize(function() {
      helpers.responsiveJS();
    });

    eventHandlers();
  })();

  function eventHandlers() {
    $('#testGridButton').click(function(){
      medImageService.setUserImages($scope);
    });
  }
});