var medImageApp = angular.module('medImageApp', []);

medImageApp.controller("medImageAppController", function($scope) {
  // Public /////////////////////////////////////////////////////////

  var public = $scope.viewModel = {
    images : [{test: 'hi'}]
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
    $('#testButton').click(function(e){
      e.preventDefault();
      // console.log(gridController.viewModel);

    });
  }

  var init = (function() {
    helpers.sizingJS();
    $(window).resize(function() {
      helpers.responsiveJS();
    });

    eventHandlers();
  })();

});