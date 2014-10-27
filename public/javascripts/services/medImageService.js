medImageApp = angular.module('medImageApp');

medImageApp.service('medImageService', function() {

  // Define shared methods
  function setUserImages(scope){
    ajaxController.get("/users/" + scope.user + "/medimages")
    .success(function(res) {
      scope.viewModel.images = res;
      scope.$apply();
    })
    .error(function(res){
      console.log('error');
    });
  }

  // Share the methods
  return {
    setUserImages: setUserImages
  }
});