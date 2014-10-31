var medImageApp = angular.module('medImageApp', []);

medImageApp.controller("medImageAppController", function($scope, $rootScope) {
  // Public /////////////////////////////////////////////////////////

  var public = $scope.viewModel = {
    images : [{test: 'hi'}], 
    editing: false
  }


  // Private ////////////////////////////////////////////////////////

  var private = (function() {
    return {

    }
  })();

  var helpers = (function() {
    function sizingJS() {}

    function responsiveJS() {
      sizingJS();
    }

    return {
      sizingJS: sizingJS, 
      responsiveJS: responsiveJS
    }
  })();

  var eventHandlers = function() {
    $("#logoutButton").on("click", function() {
      ajaxController.post("/logout").always(function() {
        window.location.replace("/");
      });
    });

    $scope.editImage = function(imgUrl, image_id, imgTitle) {
      $rootScope.editing = true;
      $rootScope.imgUrl = imgUrl;
      $rootScope.image_id = image_id;
      $rootScope.imgTitle = imgTitle;
    }
  }

  var init = (function() {
    helpers.sizingJS();
    $(window).resize(function() {
      helpers.responsiveJS();
    });

    eventHandlers();
  })();

});