/*  editorController
*
*   Angular Controller for closeup image editing mixin
* 
*   @author: Danny Sanchez
*/

var medImageApp = angular.module('medImageApp');

medImageApp.controller('editorController', function($scope, $rootScope) {

  // Public /////////////////////////////////////////////////////////

  var public = $scope.viewModel = {
    user: {
      username: $("#div-user-data")[0].getAttribute("data-username")
    }, 
    isContributor: false, 
    isCreator: false
  }

  // Private ////////////////////////////////////////////////////////

  var local = {};

  var setLocal = function() {
    local.ctx = $("#imageCanvas")[0].getContext('2d');
    local.img = new Image();
    local.img.src = $rootScope.imgUrl;
    local.image_id = $rootScope.image_id;
    local.editorImg = new EditorImg(local.img, new Coord(0, 0), 1, local.ctx, $("#imageCanvas")[0]);
    local.editType = "edit";
    local.annotation;
    local.pointAnnotations = [];
    local.rangeAnnotations = [];
    local.circleRadius = 7;
  }

  // Helper functions
  var helpers = (function() {

    var drawImg = function() {

      local.editorImg.draw(local.ctx, $("#imageCanvas"));
    }

    var zoomIn = function(amount) {
      local.editorImg.zoomIn(amount);
      drawAnnotations();
    }

    var zoomOut = function(amount) {
      local.editorImg.zoomOut(amount);
      drawAnnotations();
    }

    var drawAnnotations = function() {
      for (var i = 0; i < local.pointAnnotations.length; i++) {
        var pointAnnotation = local.pointAnnotations[i];
        pointAnnotation.draw();
      }

      for (var i = 0; i < local.rangeAnnotations.length; i++) {
        var rangeAnnotation = local.rangeAnnotations[i];
        rangeAnnotation.draw();
      }
    }

    var showAnnotationInput = function(e, text) {
      if (text !== undefined) {
        $("#annotationInput").val(text);
      }

      $("#annotationInputCont").css("display", "block");

      if (e !== undefined) {
        $("#annotationInputCont").css("left", e.pageX + local.circleRadius + 5 + "px");
        $("#annotationInputCont").css("top", e.pageY + "px");
        $("#annotationInput").focus();
      }
    }

    var hideAnnotationInput = function(annotationClicked) {
      if (!annotationClicked) {
        $("#annotationInputCont").css("display", "none");
        annotationClicked = false;
      }
    }

    var checkInsideRectangle = function(rectangle, x, y) {
      var startCoord = local.editorImg.toCanvasCoord(rectangle.startCoord);
      var endCoord = local.editorImg.toCanvasCoord(rectangle.endCoord);

      var checkY = function(startCoord, endCoord, y) {
        if (endCoord.y > startCoord.y) {
          // Rectangle drawn top down
          if (y > startCoord.y && y < endCoord.y) {
            return true;
          } else {
            return false
          }
        } else {
          // Rectangle drawn bottom up
          if (y < startCoord.y && y > endCoord.y) {
            return true;
          } else {
            return false;
          }
        }
      }

      if (endCoord.x > startCoord.x) {
        
        // Rectangle drawn left to right
        if (x > startCoord.x && x < endCoord.x) {
          return checkY(startCoord, endCoord, y);
        } else {
          return false
        }
      } else {

        // Rectangle drawn right to left
        if (x < startCoord.x && x > endCoord.x) {
          return checkY(startCoord, endCoord, y);
        } else {
          return false;
        }
      }
    }

    var setAnnotation = function(annotation, callback) {
      if (!local.annotation || local.annotation.mutex.state() == "resolved") {
        local.annotation = annotation;
        if (callback) {
          callback(annotation);
        }
      } else {
        local.annotation.mutex.done(function() {
          local.annotation = annotation;
          if (callback) {
            callback(annotation);
          }
        });
      }
    }

    var deleteAnnotation = function() {
      var index;
      // Check point annotations
      index = local.pointAnnotations.indexOf(local.annotation);

      if (index > -1) {
        local.pointAnnotations.splice(index, 1);
        drawImg();
        drawAnnotations();
        if (local.annotation.inDB()) {
          local.annotation.del();
        }

        helpers.setAnnotation(undefined);
        return;
      }

      // Check range annotations
      index = local.rangeAnnotations.indexOf(local.annotation);
      if (index > -1) {
        local.rangeAnnotations.splice(index, 1);
        drawImg();
        drawAnnotations();
        if (local.annotation.inDB()) {
          local.annotation.del();
        }

        helpers.setAnnotation(undefined);
        return;
      }
    }

    // Edit type
    var changeEditType = function(editType, mouseType, $this) {
      local.editType = editType;
      $("#imageCanvas").css("cursor", mouseType);
      $(".editTypeBtn").attr("disabled", false)
                       .removeClass("highlight");
      $this.attr("disabled", true).addClass("highlight");
    }

    return {
      drawImg: drawImg, 
      zoomIn: zoomIn, 
      zoomOut: zoomOut, 
      drawAnnotations: drawAnnotations, 
      showAnnotationInput: showAnnotationInput, 
      hideAnnotationInput: hideAnnotationInput, 
      checkInsideRectangle: checkInsideRectangle, 
      setAnnotation: setAnnotation, 
      deleteAnnotation: deleteAnnotation, 
      changeEditType: changeEditType
    }
  })();

  // Ajax helpers
  var ajax = (function() {
    var exports = {};

    // Tags /////////////////////////////////////////////////////////
    exports.getTags = function() {
      return ajaxController.get('/tag/' + local.image_id).done(function(res) {
        public.tags = res;
        $scope.$apply();

        eventListeners.tagEventReset();
      }).fail(function(e) {
        alert(e.responseText);
      }); 
    }

    exports.addTag = function(data) {
      return ajaxController.post('/tag/' + local.image_id, data).done(function(res) {
        public.tagError = false;
        exports.getTags();

        $("#addTagInput").val("");
      }).fail(function(e) {
        public.tagError = true;
        public.tagErrorText = e.responseText;
        $scope.$apply();
      });
    }

    exports.deleteTag = function(data) {
      return ajaxController.del('/tag/' + local.image_id, data).done(function() {
        for (var i = 0; i < public.tags.length; i++) {
          if (data.tag == public.tags[i].tag_name) {
            public.tags.splice(i, 1);
            break;
          }
        }

        $scope.$apply();
      });
    }

    // Contributors /////////////////////////////////////////////////
    exports.getContributors = function() {
      return ajaxController.get('/medimages/' + local.image_id + '/contributions').done(function(res) {

        public.contributions = res;
        public.contributionsUsernames = [];
        for (var i = 0; i < res.contributions.length; i++) {
          var contribution = res.contributions[i];
          var username = res.userIDToUser[contribution.user_id].username;
          public.contributionsUsernames.push(username);
        } 

        public.isContributor = public.contributionsUsernames.indexOf(public.user.username) > -1;
        $scope.$apply();

        eventListeners.isContributorEventsReset();
      }).fail(function(e) {
        alert(e.responseText);
      });
    }

    exports.addContributor = function(username) {
      var data = {
        username: username, 
        image_id: local.image_id
      }

      return ajaxController.post('/contributions', data).done(function(res) {
        public.contributionError = false;
        public.contributions = [];

        exports.getContributors();
        $("#addContributionInput").val("");
      }).fail(function(e) {
        public.contributionError = true;
        public.contributionErrorText = e.responseText;
        $scope.$apply();
      });
    }

    exports.deleteContributor = function(data) {
      ajaxController.del('/contributions/' + data.contributionID).done(function() {

        // Remove contributor from client side memory, update view
        for (var i = 0; i < public.contributions.contributions.length; i++) {
          if (data.contributionID == public.contributions.contributions[i]._id) {
            public.contributions.contributions.splice(i, 1);

            var index = public.contributionsUsernames.indexOf(data.username);
            public.contributionsUsernames.splice(i, 1);

            $scope.$apply();
            break;
          }
        }
      });
    }

    // Annotations //////////////////////////////////////////////////
    exports.getAnnotations = function() {
      return ajaxController.get('/medImages/' + local.image_id + '/annotations').done(function(res) {
        for (var i = 0; i < res.length; i++) {
          var annotation = res[i];
          if (annotation.__t == "PointAnnotation") {
            local.pointAnnotations.push(createPointAnnotation(annotation));
          } else if (annotation.__t == "RangeAnnotation") {
            local.rangeAnnotations.push(createRangeAnnotation(annotation));
          }
        }

        helpers.drawAnnotations();
      });
    }

    // MedImages ////////////////////////////////////////////////////
    exports.getMedImage = function(image_id) {

      return ajaxController.get('/medimages/' + image_id).done(function(res) {
        local.medImage = res;
        public.creator = res._creator;
        public.isCreator = (public.user.username == public.creator.username);

        exports.getAnnotations();

        $scope.$apply();

        eventListeners.isCreatorEventsReset();
      });
    }

    exports.deleteMedImage = function(image_id) {
      return ajaxController.del('/medimages/' + image_id).done(function(res) {
        $("#homeButton").children("button").click();

        $scope.$apply();
      });
    }

    exports.editTitle = function(data) {
      ajaxController.put("medimages/" + local.image_id, data).done(function(res) {
        // Green border
        $("#titleInput").removeClass("inputError");
      });
    }

    return exports;
  })();

  // Starts all processes
  var init = function() {
    setLocal();
    imgInit();

    sizingJS();
    $(window).resize(function() {
      responsiveJS();
    });

    ajax.getTags();
    ajax.getContributors();

    eventListeners.main();
  };

  var imgInit = function() {
    
    var img = local.img;

    img.onload = function() {
      helpers.drawImg();
      ajax.getMedImage(local.image_id);
    }
  }

  var sizingJS = function() {
    $(".editorContainer").height($(window).height() - 60);
    $("#imageCanvas")[0].width = $("#imageCanvas").parent().width();
    $("#imageCanvas")[0].height = $("#imageCanvas").parent().height();
  }

  var responsiveJS = function() {
    sizingJS();
    helpers.drawImg();
    helpers.drawAnnotations();
  }

  var createPointAnnotation = function(dbAnnotation) {
    return new PointAnnotation(dbAnnotation.text, 
                               new Coord(dbAnnotation.start_point.x, 
                                         dbAnnotation.start_point.y), 
                               local.ctx, 
                               local.editorImg, 
                               local.image_id, 
                               local.circleRadius, 
                               dbAnnotation._id);
  }

  var createRangeAnnotation = function(dbAnnotation) {
    return new RangeAnnotation(dbAnnotation.text, 
                               new Coord(dbAnnotation.start_point.x, 
                                         dbAnnotation.start_point.y), 
                               new Coord(dbAnnotation.end_point.x, 
                                         dbAnnotation.end_point.y), 
                               local.ctx, 
                               local.editorImg, 
                               local.image_id, 
                               dbAnnotation._id)
  }

  var eventListeners = (function() {

    var exports = {};

    var annotationClicked = false;
    var overAnnotation = false;

    // Main listeners, loaded immediately
    exports.main = function() {

      // Canvas listeners
      (function() {
        var drawing = false;
        var startDrag = false;
        var dragging = false;
        var lastEventCoord = new Coord();
        var startCoord;
        var endCoord;

        $("#imageCanvas").on("mousedown", function(e) {

          lastEventCoord = getEventCoord(e);
          
          if (local.editType == "edit") {
            if (public.isContributor) {
              // Notice startDrag if mouse over annotation
              if (overAnnotation) {
                startDrag = true;
              }
            }
          } else if (local.editType == "move") {

            // Draw image and annotations
            drawing = true;
            local.editorImg.draw();
            helpers.drawAnnotations();
          } else if (local.editType == "annotation") {

            // set the start coordinate of our annotation
            drawing = true;
            startCoord = local.editorImg.toImgCoord(lastEventCoord);
          } else {

            throw new Error("Invalid editType:" + local.editType);
          }
        });

        $("#imageCanvas").on("mousemove", function(e) {

          if (local.editType == "edit") {

            // If we've started dragging, move the current annotation with the mouse
            if (local.annotation && startDrag && public.isContributor) {

              if (dragging || (Math.abs(e.offsetX - lastEventCoord.x) >= 0.5 ||
                               Math.abs(e.offsetY - lastEventCoord.y) >= 0.5)) {

                dragging = true;

                local.annotation.move(e, lastEventCoord, local.editorImg);

                local.editorImg.draw();
                helpers.drawAnnotations();

                helpers.hideAnnotationInput(annotationClicked);
              } else {
                return;
              }

            // If we haven't started dragging and have not clicked an annotation
            // display the annotation we are hovering over
            } else {

              // Look for point annotations close by first
              for (var i = 0; i < local.pointAnnotations.length; i++) {
                var annotation = local.pointAnnotations[i];
                var canvasCoord = local.editorImg.toCanvasCoord(annotation.coord);

                if (Math.abs(e.offsetX - canvasCoord.x) <= local.circleRadius &&
                    Math.abs(e.offsetY - canvasCoord.y) <= local.circleRadius) {
                  
                  if (!annotationClicked) {
                    var text = annotation.text;
                    helpers.showAnnotationInput(e, text);

                    helpers.setAnnotation(annotation);
                  }

                  overAnnotation = true;

                  return;
                }
              }

              // Then look for range annotatations
              for (var i = 0; i < local.rangeAnnotations.length; i++) {
                var annotation = local.rangeAnnotations[i];
                if (helpers.checkInsideRectangle(annotation.rectangle, e.offsetX, e.offsetY)) {
                  
                  if (!annotationClicked) {  
                    var text = annotation.text;
                    helpers.showAnnotationInput(e, text);

                    helpers.setAnnotation(annotation);
                  }

                  overAnnotation = true;

                  return;
                }
              }

              overAnnotation = false;
              helpers.hideAnnotationInput(annotationClicked);
            }

            lastEventCoord = getEventCoord(e);
          } 

          if (drawing) {
            
            if (local.editType == "move") {
              local.editorImg.move(e, lastEventCoord);
              local.editorImg.draw();

              helpers.drawAnnotations();
            } else if (local.editType == "annotation") {
              endCoord = local.editorImg.toImgCoord(lastEventCoord);
              if (Math.abs(startCoord.x - endCoord.x) * local.editorImg.zoom <= local.circleRadius &&
                  Math.abs(startCoord.y - endCoord.y) * local.editorImg.zoom <= local.circleRadius) {

                var annotation = new PointAnnotation("", endCoord, local.ctx, 
                                                          local.editorImg, local.image_id, 
                                                          local.circleRadius); 

                local.editorImg.draw();
                helpers.drawAnnotations();
                annotation.draw();                
              } else {
                
                var annotation = new RangeAnnotation("", startCoord, endCoord, 
                                                          local.ctx, local.editorImg, 
                                                          local.image_id); 

                local.editorImg.draw();
                helpers.drawAnnotations();
                annotation.draw();                  
              }
            } else {
              throw new Error("Invalid editType:" + local.editType);
            }

            lastEventCoord = getEventCoord(e);
          }
        });

        $("#imageCanvas").on("mouseup", function(e) {
          if (dragging) {
            dragging = false;
            local.annotation.submit();
          } else {
            if (local.editType == "edit" && public.isContributor) {
              if (overAnnotation) {
                helpers.showAnnotationInput(e);
                annotationClicked = true;
              } else {
                helpers.hideAnnotationInput(false);
                annotationClicked = false;
              }
            }
          }
        });

        $("body").on("mouseup", function(e) {
          
          if (drawing) {
            if (local.editType == "edit") {

            } else if (local.editType == "move") {
              local.editorImg.draw();
              helpers.drawAnnotations();
            } else if (local.editType == "annotation") {
              local.editorImg.draw();
              helpers.drawAnnotations();
              if (local.annotation && local.annotation.text.trim().length == 0) {
                helpers.deleteAnnotation();
                annotationClicked = false;
                overAnnotation = false;
              } else if (!local.annotation || local.annotation.mutex.state() == "resolved") {

                endCoord = local.editorImg.toImgCoord(lastEventCoord);
                if (Math.abs(startCoord.x - endCoord.x) <= local.circleRadius &&
                    Math.abs(startCoord.y - endCoord.y) <= local.circleRadius) {

                  helpers.setAnnotation(new PointAnnotation("", endCoord, local.ctx, 
                                                            local.editorImg, local.image_id, 
                                                            local.circleRadius), 
                                        function(annotation) {
                    local.pointAnnotations.push(annotation);
                    annotation.draw();

                    // Show input box
                    helpers.showAnnotationInput(e, "");
                  });
                } else {
                  
                  helpers.setAnnotation(new RangeAnnotation("", startCoord, endCoord, 
                                                            local.ctx, local.editorImg, 
                                                            local.image_id), 
                                        function(annotation) {
                    local.rangeAnnotations.push(annotation);
                    annotation.draw();

                    // Show input box
                    helpers.showAnnotationInput(e, "");
                  });
                }

              }
            } else {
              throw new Error("Invalid editType:" + local.editType);
            }

            startCoord = undefined;
            lastEventCoord = getEventCoord(e);
            drawing = false;
          }

          startDrag = false;
        });
      })();

      // Controls
      (function() {

        $("#editBtn").on("click", function() {
          helpers.changeEditType("edit", "default", $(this));
        });

        $("#moveBtn").on("click", function() {
          helpers.changeEditType("move", "move", $(this));
        });


        // Zoom
        $("#zoomInBtn").on("click", function() {
          helpers.zoomIn(0.2);
        });

        $("#zoomOutBtn").on("click", function() {
          helpers.zoomOut(0.2);
        });

      })();

      // Tooltips
      $("#zoomInBtn").tooltip({placement: "bottom", title: "Zoom in"});
      $("#zoomOutBtn").tooltip({placement: "bottom", title: "Zoom out"});
      $("#editBtn").tooltip({placement: "bottom", title: "Edit and view annotations"});
      $("#annotationBtn").tooltip({placement: "bottom", title: "Create annotation"});
      $("#moveBtn").tooltip({placement: "bottom", title: "Move image"});
    };

    //Listeners that are reset based on ajax
    (function() {

      // Event Functions ////////////////////////////////////////////

      var addContributionSubmit = function(e) {
        e.preventDefault()

        var username = $("#addContributionForm")[0].elements["username"].value;

        ajax.addContributor(username);
      }

      var deleteContributionSubmit = function(e) {

        e.preventDefault();

        var data = {
          contributionID: $(this)[0].elements["contribution_id"].value,
          username: $(this)[0].elements["contribution_username"].value
        }
        
        ajax.deleteContributor(data);
      }

      var addTagSubmit = function(e) {
        e.preventDefault();

        var data = $(this).serializeArray();
        ajax.addTag(data);
      }

      var deleteTagSubmit = function(e) {
        e.preventDefault();

        var tagName = $(this)[0].elements["tag"].value;
        var data = {
          tag: tagName
        }

        ajax.deleteTag(data);
      }

      var annotationBtnClick = function() {

        helpers.changeEditType("annotation", "crosshair", $(this));
      }

      var editTitleSubmit = function(e) {
        e.preventDefault();

        var title = $("#titleInput").val().trim();

        if (title && title.length > 0) {
          var data = {
            title: title
          };

          ajax.editTitle(data);
        } else {
          $("#titleInput").addClass("inputError");
        }
      }

      var inputKeyup = function(e) {

        if (public.isContributor) {
          if (e.keyCode == 13) { // Enter
            annotationClicked = false;
            if (local.annotation) {
              
              if ($("#annotationInput").val().trim().length == 0) {
                helpers.deleteAnnotation();
                overAnnotation = false;

              } else {
                local.annotation.text = $("#annotationInput").val();
                local.annotation.submit();
              }
              helpers.hideAnnotationInput(annotationClicked);
            }
          } else if (e.keyCode == 27) { // Escape
            annotationClicked = false;
            if (local.annotation) {
              if (local.annotation.mutex.state() == "resolved") {
                if (!local.annotation.inDB()) {
                  helpers.deleteAnnotation();              
                  overAnnotation = false;
                }
              } else {
                local.annotation.mutex.done(function() {
                  if (!local.annotation.inDB()) {
                    helpers.deleteAnnotation();               
                    overAnnotation = false;
                  }
                });
              }
            }

            helpers.hideAnnotationInput(annotationClicked);
          }
        }
      }

      var annotationDeleteClick = function() {
        helpers.deleteAnnotation();
        annotationClicked = false;
        overAnnotation = false;
        helpers.hideAnnotationInput();
      }

      var deleteImgBtnClick = function() {

        ajax.deleteMedImage(local.image_id);
      }

      // Event binding and unbinding ////////////////////////////////

      // add and delete tag

      exports.tagEventOff = function() {
        $(".deleteTagForm").off("submit", deleteContributionSubmit);
        $("#addTagForm").off("submit", addTagSubmit);
      }

      exports.tagEventOn = function() {
        $(".deleteTagForm").on("submit", deleteTagSubmit);
        $("#addTagForm").on("submit", addTagSubmit);
      }

      exports.tagEventReset = function() {
        exports.tagEventOff();
        exports.tagEventOn();
      }

      // annotationBtn

      exports.annotationBtnEventOff = function() {

        $("#annotationBtn").off("click", annotationBtnClick);
      }

      exports.annotationBtnEventOn = function() {

        $("#annotationBtn").on("click", annotationBtnClick);
      }

      exports.annotationBtnEventReset = function() {
        exports.annotationBtnEventOff();
        exports.annotationBtnEventOn();
      }

      // add and delete contribution

      exports.contributionEventOff = function() {
        $("#addContributionForm").off("submit", addContributionSubmit);
        $(".deleteContributionForm").off("submit", deleteContributionSubmit);
      }

      exports.contributionEventOn = function() {
        $("#addContributionForm").on("submit", addContributionSubmit);
        $(".deleteContributionForm").on("submit", deleteContributionSubmit);
      }

      exports.contributionEventReset = function() {
        exports.contributionEventOff();
        exports.contributionEventOn();
      }

      // annotationInput

      exports.inputEventOff = function() {

        $("#annotationInput").off("keyup", inputKeyup);
      }

      exports.inputEventOn = function() {
        
        $("#annotationInput").on("keyup", inputKeyup);
      }

      exports.inputEventReset = function() {
        exports.inputEventOff();
        exports.inputEventOn();
      }

      // titleInput

      exports.titleEventOff = function() {

        $("#titleInput").off("keyup", editTitleSubmit);
      }

      exports.titleEventOn = function() {

        $("#titleInput").on("keyup", editTitleSubmit);
      }

      exports.titleEventReset = function() {
        exports.titleEventOff();
        exports.titleEventOn();
      }

      // annotationDelete

      exports.annotationDeleteEventOff = function() {

        $("#annotationDeleteBtn").off("click", annotationDeleteClick);
      }

      exports.annotationDeleteEventOn = function() {
        
        $("#annotationDeleteBtn").on("click", annotationDeleteClick);
      }

      exports.annotationDeleteEventReset = function() {
        exports.annotationDeleteEventOff();
        exports.annotationDeleteEventOn();
      }

      // DeleteImgBtn

      exports.deleteImgBtnEventOff = function() {

        $("#deleteImg").off("click", deleteImgBtnClick);
      }

      exports.deleteImgBtnEventOn = function() {

        $("#deleteImg").on("click", deleteImgBtnClick);
      }

      exports.deleteImgBtnEventReset = function() {
        exports.deleteImgBtnEventOff();
        exports.deleteImgBtnEventOn();
      }

      // Reset events based on when isContributor is redefined
      exports.isContributorEventsReset = function() {
        exports.contributionEventReset();
        exports.tagEventReset();
        exports.annotationBtnEventReset();
        exports.inputEventReset();
        exports.annotationDeleteEventReset();
      }

      // Reset events based on when isCreator is redefined
      exports.isCreatorEventsReset = function() {
        eventListeners.contributionEventReset();
        eventListeners.deleteImgBtnEventReset();
        eventListeners.titleEventReset();
      }
    })();

    return exports;
  })();

  init();
});