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
        console.log("ERROR: " + type + " request to " + url + " failed with the following error: \n" + e.responseText);
      }
    });
  }
}