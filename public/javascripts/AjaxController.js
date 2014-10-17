var AjaxController = function() {
  this.get = function(url, doneCallback, failCallback) {
    return ajaxReq("GET", url, null, doneCallback, failCallback);
  }

  this.post = function(url, data, doneCallback, failCallback) {
    return ajaxReq("POST", url, data, doneCallback, failCallback);
  }

  this.put = function(url, data, doneCallback, failCallback) {
    return ajaxReq("PUT", url, data, doneCallback, failCallback);
  }

  this.del = function(url, data, doneCallback, failCallback) {
    return ajaxReq("DELETE", url, data, doneCallback, failCallback);
  }

  var ajaxReq = function(type, url, data, doneCallback, failCallback) {
    return $.ajax({
      datatype: "json", 
      type: type, 
      url: url, 
      data: data
    }).done(function(res) {
      doneCallback(res);
    }).fail(function(e) {
      if (failCallback !== undefined && typeof failCallback == "function") {
        failCallback(e);
      } else {
        console.log("ERROR: " + type + " request to " + url + " failed with the following error: \n" + e.responseText);
      }
    });
  }
}

var ajaxController = new AjaxController();