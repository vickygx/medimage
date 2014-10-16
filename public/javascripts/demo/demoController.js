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

  var AjaxController = function() {
    this.get = function(url, data, failCallback) {
      return ajaxReq("GET", url, data, failCallback);
    }

    this.post = function(url, data, failCallback) {
      return ajaxReq("POST", url, data, failCallback);
    }

    this.put = function(url, data, failCallback) {
      return ajaxReq("PUT", url, data, failCallback);
    }

    this.del = function(url, data, failCallback) {
      return ajaxReq("DELETE", url, data, failCallback);
    }

    var ajaxReq = function(type, url, data, failCallback) {
      return $.ajax({
        datatype: "json", 
        type: type, 
        url: url, 
        data: data
      }).done(function(res) {
        return res;
      }).fail(function(e) {
        if (failCallback) {
          failCallback(e);
        } else {
          console.log("ERROR: " + type + " request to " + url + " failed with the following error: \n", e);
        }
      });
    }
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


    /////////////////////////////////////////////////////////////////
    // Tags
    /////////////////////////////////////////////////////////////////
  }

  return {
    public: public, 
    init: init
  }
}