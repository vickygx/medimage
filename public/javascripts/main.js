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
    $("#logoutButton").on("click", function() {
      ajaxController.post("/logout").always(function() {
        window.location.replace("/");
      });
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