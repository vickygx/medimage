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
      $("#annotationsGetBtn").on("click", function() {
        var data = {};

        ajaxController.get('/annotation/0', data).done(function(res) {
          $("#annotationsGet").text(res);
        });
      });

      $("#annotationsCreateBtn").on("click", function() {
        var data = {};

        ajaxController.post('/annotation', data).done(function(res) {
          $("#annotationsCreate").text(res);
        });
      });

      $("#annotationsEditBtn").on("click", function() {
        var data = {};

        ajaxController.put('/annotation', data).done(function(res) {
          $("#annotationsEdit").text(res);
        });
      });

      $("#annotationsDeleteBtn").on("click", function() {
        var data = {};

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