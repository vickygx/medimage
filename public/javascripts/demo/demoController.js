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

        ajaxController.get('/users').always(function(res) {
          $("#usersGet").text(JSON.stringify(res));
        });
      });

      // Create a new user
      $("#usersCreateForm").on("submit", function(e) {

        e.preventDefault();
        var data = $(this).serializeArray();

        ajaxController.post('/users', data).always(function(res) {
          $("#usersCreate").text(JSON.stringify(res));
        });
      });

      // Edit an existing user
      $("#usersEditForm").on("submit", function(e) {

        e.preventDefault();
        var data = $(this).serializeArray();

        ajaxController.put('/users/' + data[0].value, data).always(function(res) {
          $("#usersEdit").text(JSON.stringify(res));
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

        ajaxController.get('/medImages/' + data[0].value + '/annotations').always(function(res) {
          $("#annotationsGet").text(JSON.stringify(res));
        });
      });

      // Create a new point annotation
      $("#pointAnnotationsCreateForm").on("submit", function(e) {

        e.preventDefault();
        var data = $(this).serializeArray();

        ajaxController.post('/annotations', data).always(function(res) {
          $("#pointAnnotationsCreate").text(JSON.stringify(res));
        });
      });

      // Create a new range annotation
      $("#rangeAnnotationsCreateForm").on("submit", function(e) {

        e.preventDefault();
        var data = $(this).serializeArray();

        ajaxController.post('/annotations', data).always(function(res) {
          $("#rangeAnnotationsCreate").text(JSON.stringify(res));
        });
      });

      // Edit an existing annotation
      $("#annotationsEditForm").on("submit", function(e) {

        e.preventDefault();
        var data = $(this).serializeArray();

        ajaxController.put('/annotations/' + data[0].value, data).always(function(res) {
          $("#annotationsEdit").text(JSON.stringify(res));
        });
      });

      // Delete an annotation
      $("#annotationsDeleteForm").on("submit", function(e) {

        e.preventDefault();
        var data = $(this).serializeArray();

        ajaxController.del('/annotations/' + data[0].value, data).always(function(res) {
          $("#annotationsDelete").text(JSON.stringify(res));
        });
      });
    })();

    /////////////////////////////////////////////////////////////////
    // Contributions
    /////////////////////////////////////////////////////////////////

    (function() {

      // Check for access of image
      $("#accessToImageForm").on("submit", function(e) {
        e.preventDefault();

        var username = $(this)[0].elements["username"].value;
        var imageID = $(this)[0].elements["image_id"].value;
        var accessUrl = "/contributions/access?username=" + encodeURIComponent(username)
                      + "&imageID=" + encodeURIComponent(imageID);
        ajaxController.get(accessUrl).always(function(res) {
          $("#contributionAccess").text(JSON.stringify(res));
        });
      });

      // Get all users contributing to an image
      $("#imageContributorsForm").on("submit", function(e) {
        e.preventDefault();

        var imageID = $(this)[0].elements["image_id"].value;

        ajaxController.get("/medimages/" + imageID + "/contributions").always(function(res) {
          $("#contributionUsers").text(JSON.stringify(res));
        });

      });

      // Get all users contributing to an image
      $("#userContributionsForm").on("submit", function(e) {
        e.preventDefault();

        var username = $(this)[0].elements["username"].value;

        ajaxController.get("/users/" + username + "/contributions").always(function(res) {
          $("#contributionImages").text(JSON.stringify(res));
        });
      });

      // Create Contribution
      $("#createContributionForm").on("submit", function(e) {
        e.preventDefault();

        var data = {
          username: $(this)[0].elements["username"].value,
          image_id: $(this)[0].elements["image_id"].value
        };

        ajaxController.post('/contributions', data).always(function(res) {
          $("#contributionCreate").text(JSON.stringify(res));
        });
      });

      // Delete Contribution
      $("#deleteContributionForm").on("submit", function(e) {
        e.preventDefault();

        var contributionID = $(this)[0].elements["contribution_id"].value;
        ajaxController.del('/contributions/' + contributionID).always(function(res) {
          $("#contributionDelete").text(JSON.stringify(res));
        });
      });
    })();

    /////////////////////////////////////////////////////////////////
    // MedImages
    /////////////////////////////////////////////////////////////////

    (function() {
      // Get MedImages for a User
      $("#medImageForUserForm").on("submit", function(e) {
        //prevent reload
        e.preventDefault();

        var username = $(this)[0].elements["username"].value;
        ajaxController.get("/users/" + username + "/medimages").always(function(res) {
          $("#medImageForUser").text(JSON.stringify(res));
        });
      });

      // Create MedImage
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
          contentType: false,
          processData: false,
        }).always(function(res) {
          $("#medImageCreate").text(JSON.stringify(res));
        });
      });

      //Edit title of MedImage
      $("#editImageForm").on("submit", function(e) {
        e.preventDefault();

        var imageID = $(this)[0].elements["image_id"].value;
        var data = { title: $(this)[0].elements["title"].value };
        ajaxController.put("/medimages/" + imageID, data).always(function(res) {
          $("#medImageEdit").text(JSON.stringify(res));
        });
      });

      //Delete MedImage
      $("#deleteImageForm").on("submit", function(e) {
        e.preventDefault();

        var imageID = $(this)[0].elements["image_id"].value;
        ajaxController.del("/medimages/" + imageID).always(function(res) {
          $("#medImageDelete").text(JSON.stringify(res));
        });
      });
    })();

    /////////////////////////////////////////////////////////////////
    // Tags
    /////////////////////////////////////////////////////////////////
    (function(){

      // Get all the tags of the medical image with given id
      $("#tagGetForm").on("submit", function(e) {
        e.preventDefault();
        var image_id = $('#tagGetForm input[name="image_id"]').val();

        ajaxController.get('/tag/' + image_id)
          .always(function(res) {
            $("#tagsGet").text(JSON.stringify(res));
        });
      });

      // Add a tag to the medical image with given id
      $("#tagAddForm").on("submit", function(e) {
        e.preventDefault();
        var data = $(this).serializeArray();
        var image_id = $('#tagAddForm input[name="image_id"]').val();

        ajaxController.post('/tag/' + image_id, data)
          .always(function(res) {
            $("#tagsAdd").text(JSON.stringify(res));
        });
      });

      // Remove a tag from the medical image with given id
      $("#tagRemoveForm").on("submit", function(e) {

        e.preventDefault();
        var data = $(this).serializeArray();
        var image_id = $('#tagRemoveForm input[name="image_id"]').val();

        ajaxController.del('/tag/' + image_id, data)
          .always(function(res) {
            $("#tagsRemove").text(JSON.stringify(res));
        });
      });

      // Search tags
      $("#tagSearchForm").on("submit", function(e) {
        e.preventDefault();
        var tags = $("#tags").val().split(',');
        var tagString = '';
        for (var i = 0; i < tags.length ; i++){
          tagString += 'tag=' + tags[i].trim() + '&';
        }
        var limit = $('#tagSearchForm input[name="limit"]').val();
        tagString += 'limit=' + limit;

        ajaxController.get('/search/tags?' + tagString)
          .always(function(res) {
            $("#tagsPhotoGet").text(JSON.stringify(res));
        });
      });
    })();
  }

  return {
    public: public, 
    init: init
  }
}