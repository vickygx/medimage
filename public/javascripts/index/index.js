var medImageApp = angular.module('medImageApp');

medImageApp.controller("indexController", function($scope) {
  // Public /////////////////////////////////////////////////////////

  var public = $scope.viewModel = {
    isLogin: false
  }

  $scope.switchForm = function() {
    public.isLogin = !public.isLogin;
  }


  // Private ////////////////////////////////////////////////////////

  var private = (function() {
    var formErrorStyle = {
      "color": "#a94442",
      "background-color": "#f2dede",
      "border": "1px solid #ebccd1",
      "border-radius": "4px",
      "padding": "2px"
    }

    return {
      formErrorStyle: formErrorStyle
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

  var init = (function() {
    helpers.sizingJS();
    $(window).resize(function() {
      helpers.responsiveJS();
    });

    eventHandlers();
  })();

  function eventHandlers() {

    //Login event handler
    $("#loginForm").on("submit", function(e) {
      e.preventDefault();

      var data = {
        username: $(this)[0].elements["username"].value,
        password: $(this)[0].elements["password"].value
      }

      ajaxController.post("/login", data).success(function(res) {
        window.location.replace("/main");
      }).error(function(res) {
        $("#loginForm .formError").text(res.responseText).css(private.formErrorStyle);
      });
    });

    //Sign up event handler
    $("#registerForm").on("submit", function(e) {
      e.preventDefault();

      var data = {
        first_name: $(this)[0].elements["first_name"].value,
        last_name: $(this)[0].elements["last_name"].value,
        username: $(this)[0].elements["username"].value,
        password: $(this)[0].elements["password"].value
      }

      ajaxController.post("/users", data).success(function(res) {
        window.location.replace("/main");
      }).error(function(res) {
        $("#registerForm .formError").text(res.responseText).css(private.formErrorStyle);
      });
    });
  }
});