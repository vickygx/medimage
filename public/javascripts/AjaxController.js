/**
 * Controller for easily sending common ajax requests
 * @constructor
 */
var AjaxController = function() {

  /** 
   * Sends a get request to the given url
   * @param {String} url: url to send get request to
   * @returns {jqHXR object}
   */
  this.get = function(url) {
    return ajaxReq("GET", url, null);
  }

  /**
   * Sends a post request to the given url
   * @param {String} url: url to send post request to
   * @param {JSON} data: data to send to given url
   * @returns {jqHXR object}
   */
  this.post = function(url, data) {
    return ajaxReq("POST", url, data);
  }

  /**
   * Sends a put request to the given url
   * @param {String} url: url to send put request to
   * @param {JSON} data: data to send to given url
   * @returns {jqHXR object}
   */
  this.put = function(url, data) {
    return ajaxReq("PUT", url, data);
  }

  /**
   * Sends a delete request to the given url
   * @param {String} url: url to send delete request to
   * @param {JSON} data: data to send to given url
   * @returns {jqHXR object}
   */
  this.del = function(url, data) {
    return ajaxReq("DELETE", url, data);
  }

  /**
   * Sends an ajax request of the given type to 
   * the given url with the given data
   * @param {String} type: type of request to send
   *                       (GET, POST, PUT, DELETE)
   * @param {String} url: url to send request to
   * @param {JSON} data: data to send to given url
   * @returns {jqHXR object}
   */
  var ajaxReq = function(type, url, data) {
    return $.ajax({
      datatype: "json", 
      type: type, 
      url: url, 
      data: data
    });
  }
}

var ajaxController = new AjaxController();