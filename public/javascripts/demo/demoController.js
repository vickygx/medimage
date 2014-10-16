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

  var ajaxController = function() {
    this.get = function(url, data) {
      return ajaxReq("GET", url, data);
    }

    this.post = function(url, data) {
      return ajaxReq("POST", url, data);
    }

    this.put = function(url, data) {
      return ajaxReq("PUT", url, data);
    }

    this.del = function(url, data) {
      return ajaxReq("DELETE", url, data);
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
    $("#annotationsGet").on("click", function() {
      var data = {};

      ajaxController.get('/annotation/0', data).done(function(res) {

      });
    });

    $("#annotationsCreate").on("click", function() {
      var data = {};

      ajaxController.post('/annotation', data).done(function(res) {

      });
    });

    $("#annotationsEdit").on("click", function() {
      var data = {};

      ajaxController.put('/annotation', data).done(function(res) {

      });
    });

    $("#annotationsDelete").on("click", function() {
      var data = {};

      ajaxController.del('/annotation', data).done(function(res) {

      });
    });
  }

  return {
    public: public, 
    init: init
  }
}