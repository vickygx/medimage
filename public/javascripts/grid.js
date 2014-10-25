var GridController = function(){

  // Adds a grid of a specific user's images
  var addUserGrid = function(username){
    // Retrieves images of given user
    getImagesOf(username, function(){
      // Populates these images into grid

    });
  }


  var getImagesOf = function(username, callback){
    ajaxController.get("/users/" + username + "/medimages")
      .always(
        callback(res);
      });
  }


}