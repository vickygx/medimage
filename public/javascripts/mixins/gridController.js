var medImageApp = angular.module('medImageApp');

medImageApp.controller('gridController', function($scope, medImageService) {

  // Public /////////////////////////////////////////////////////////

  var public = $scope.viewModel = {
    images: [{id: 'Vicky', image_url: 'http://www.nist.gov/oles/forensics/images/DNA-Strand.jpg', title: 'DNA Title', 
            tags: ['DNA', 'Science', 'Genome', 'Acid', 'Sugar']},
            {id: 'Calvin', image_url: 'http://www.nist.gov/oles/forensics/images/DNA-Strand.jpg', title: 'DNA2 Title', 
            tags: ['DNA', 'Deoxy', 'Genome', 'Acid']}]
  }


  // Private ////////////////////////////////////////////////////////

  var private = (function() {
    return {

    }
  })();

  var helpers = (function() {
    function setAllImages(){}
    function setSearchedImages(tags){}
    function setUserImages(){}

    function sizingJS() {}

    function responsiveJS() {
      sizingJS();
    }

    return {
      sizingJS: sizingJS, 
      responsiveJS: responsiveJS,
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
    $('#testUserButton').click(function(){
      medImageService.displayUserImages($scope);
    });

    $('#testSearchButton').click(function(){
      medImageService.displaySearchedImages($scope, "tag=hi&tag=DNA");
    });

    $('#testAllButton').click(function(){
      medImageService.displayAllImages($scope);
    });

  }
});