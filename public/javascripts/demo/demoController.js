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

    var ajaxController = new AjaxController();
    /////////////////////////////////////////////////////////////////
    // Annotations
    /////////////////////////////////////////////////////////////////
    (function() {

      // Get all the annotations of the medical image
      // with the given id
      $("#annotationsGetBtn").on("click", function() {
        var imageId = 0;

        ajaxController.get('/annotation/' + imageId).done(function(res) {
          $("#annotationsGet").text(res);
        });
      });

      // Create a new annotation
      $("#annotationsCreateBtn").on("click", function() {
        var data = {message: 'AnnotationCreateBtn clicked'};

        ajaxController.post('/annotation', data).done(function(res) {
          $("#annotationsCreate").text(res);
        });
      });

      // Edit an existing annotation
      $("#annotationsEditBtn").on("click", function() {
        var data = {message: 'AnnotationEditBtn clicked'};

        ajaxController.put('/annotation', data).done(function(res) {
          $("#annotationsEdit").text(res);
        });
      });

      // Delete an annotation
      $("#annotationsDeleteBtn").on("click", function() {
        var data = {message: 'AnnotationDeleteBtn clicked'};

        ajaxController.del('/annotation', data).done(function(res) {
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
          success: function(res) {
            console.log("good post request!");
            console.log("type: " + res.fileType);
          },
          error: function() {
            console.log("bad post request...");
          }
        });
      });
    })();

    /////////////////////////////////////////////////////////////////
    // Tags
    /////////////////////////////////////////////////////////////////
  }

  return {
    public: public, 
    init: init
  }
}