var DemoController = function() {
  
  // Public variables, available outside controller
  var public = {};

  // Private variables, 
  var private = {};

  // Helper functions
  var helpers = (function() {

    return {}
  })();

  // Starts all processes
  var init = function() {
    eventListeners();
  }

  var eventListeners = function() {

    /////////////////////////////////////////////////////////////////
    // Users
    /////////////////////////////////////////////////////////////////
    (function() {

      // Get all users
      $("#usersGetForm").on("submit", function(e) {

        e.preventDefault();

        ajaxController.get('/users').done(function(res) {
          $("#usersGet").text(res);
        });
      });

      // Create a new user
      $("#usersCreateForm").on("submit", function(e) {

        e.preventDefault();
        var data = $(this).serializeArray();

        ajaxController.post('/users', data).done(function(res) {
          $("#usersCreate").text(res);
        });
      });

      // Edit an existing user
      $("#usersEditForm").on("submit", function(e) {

        e.preventDefault();
        var data = $(this).serializeArray();

        ajaxController.put('/users', data).done(function(res) {
          $("#usersEdit").text(res);
        });
      });

      // Delete an user
      $("#usersDeleteForm").on("submit", function(e) {

        e.preventDefault();
        var data = $(this).serializeArray();

        ajaxController.del('/users', data).done(function(res) {
          $("#usersDelete").text(res);
        });
      });
    })();

    /////////////////////////////////////////////////////////////////
    // Annotations
    /////////////////////////////////////////////////////////////////
    (function() {

      // Get all the annotations of the medical image
      // with the given id
      $("#annotationsGetForm").on("submit", function(e) {

        e.preventDefault();
        var data = $(this).serializeArray();

        ajaxController.get('/medImages/' + data[0].value + '/annotations').done(function(res) {
          $("#annotationsGet").text(res);
        });
      });

      // Create a new point annotation
      $("#pointAnnotationsCreateForm").on("submit", function(e) {

        e.preventDefault();
        var data = $(this).serializeArray();

        ajaxController.post('/annotations', data).done(function(res) {
          $("#pointAnnotationsCreate").text(res);
        });
      });

      // Create a new range annotation
      $("#rangeAnnotationsCreateForm").on("submit", function(e) {

        e.preventDefault();
        var data = $(this).serializeArray();

        ajaxController.post('/annotations', data).done(function(res) {
          $("#rangeAnnotationsCreate").text(res);
        });
      });

      // Edit an existing annotation
      $("#annotationsEditForm").on("submit", function(e) {

        e.preventDefault();
        var data = $(this).serializeArray();

        ajaxController.put('/annotations', data).done(function(res) {
          $("#annotationsEdit").text(res);
        });
      });

      // Delete an annotation
      $("#annotationsDeleteForm").on("submit", function(e) {

        e.preventDefault();
        var data = $(this).serializeArray();

        ajaxController.del('/annotations', data).done(function(res) {
          $("#annotationsDelete").text(res);
        });
      });
    })();

    /////////////////////////////////////////////////////////////////
    // Contributions
    /////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////////////////////////
    // MedImages
    /////////////////////////////////////////////////////////////////
    (function() {
      $("#medImageForUserForm").on("submit", function(e) {
        //prevent reload
        e.preventDefault();

        var userID = $(this)[0].elements["user_id"].value;
        ajaxController.get("/users/" + userID + "/medimages").done(function(res) {
          $("#medImageForUser").text(JSON.stringify(res));
        });
      });

      $("#uploadImageForm").on("submit", function(e) {
        //prevent reload
        e.preventDefault();
        
        //get formdata
        var formData = new FormData($(this)[0]);

        //upload image
        $.ajax({
          url: "/medimages",
          type: "POST",
          data: formData,
          dataType: "json",
          contentType: false,
          processData: false,
        }).always(function(res) {
          $("#medImageCreate").text(JSON.stringify(res));
        });
      });
    })();

    $("#deleteImageForm").on("submit", function(e) {
      e.preventDefault();

      var imageID = $(this)[0].elements["image_id"].value;
      ajaxController.del("/medimages/" + imageID).always(function(res) {
        $("#medImageDelete").text(JSON.stringify(res));
      });
    });

    /////////////////////////////////////////////////////////////////
    // Tags
    /////////////////////////////////////////////////////////////////
    (function(){

      // Get all the tags of the medical image with given id
      $("#tagGetForm").on("submit", function(e) {
        e.preventDefault();
        var image_id = $('#tagGetForm input[name="image_id"]').val();

        ajaxController.get('/tag/' + image_id)
          .done(function(res) {
            $("#tagsGet").text(res.text);
        });
      });

      // Add a tag to the medical image with given id
      $("#tagAddForm").on("submit", function(e) {
        e.preventDefault();
        var data = $(this).serializeArray();
        var image_id = $('#tagAddForm input[name="image_id"]').val();

        ajaxController.post('/tag/' + image_id, data)
          .done(function(res) {
            $("#tagsAdd").text(res.text);
        });
      });

      // Add a tag to the medical image with given id
      $("#tagRemoveForm").on("submit", function(e) {

        e.preventDefault();
        var data = $(this).serializeArray();
        var image_id = $('#tagRemoveForm input[name="image_id"]').val();

        ajaxController.del('/tag/' + image_id, data)
          .done(function(res) {
            $("#tagsRemove").text(res.text);
        });
      });

      // Add a tag to the medical image with given id
      $("#tagSearchForm").on("submit", function(e) {
        e.preventDefault();
        var tags = $("#tags").val().split(',');
        var i;
        var tagString = '';
        for (i = 0; i < tags.length ; i++){
          tagString += 'tag=' + tags[i].trim() + '&';
        }

        ajaxController.get('/search?' + tagString, null)
          .done(function(res) {
            $("#tagsPhotoGet").text(res.text);
        });
      });
    })();
  }

  return {
    public: public, 
    init: init
  }
}