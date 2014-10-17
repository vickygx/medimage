var AjaxController = function() {
  this.get = function(url) {
    return ajaxReq("GET", url, null);
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

  var ajaxReq = function(type, url, data) {
    return $.ajax({
      datatype: "json", 
      type: type, 
      url: url, 
      data: data
    }).done(function(res) {
      return res;
    }).fail(function(e) {
      console.log("ERROR: " + type + " request to " + url + " failed with the following error: \n" + e.responseText);
    });
  }
}

var ajaxController = new AjaxController();