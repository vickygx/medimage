var EditorController = function() {
  
  // Public variables, available outside controller
  var public = {};

  // Private variables, 
  var private = {};

  // Occurs after document.ready
  var setPrivate = function(imgUrl, image_id) {
    private.ctx = $("#imageCanvas")[0].getContext('2d');
    private.img = new Image();
    private.img.src = imgUrl;
    private.image_id = image_id;
    private.editorImg = new EditorImg(private.img, 
                                      new Coord(0, 0), 
                                      1, 
                                      private.ctx, 
                                      $("#imageCanvas")[0]);
    private.editType = "annotation";
    private.annotation;
    private.pointAnnotations = [];
    private.rangeAnnotations = [];
    private.circleRadius = 7;
  }

  // Helper functions
  var helpers = (function() {

    var drawImg = function() {

      private.editorImg.draw(private.ctx, $("#imageCanvas"));
    }

    var zoomIn = function(amount) {
      private.editorImg.zoomIn(amount);
      drawAnnotations();
    }

    var zoomOut = function(amount) {
      private.editorImg.zoomOut(amount);
      drawAnnotations();
    }

    var drawAnnotations = function() {
      for (var i = 0; i < private.pointAnnotations.length; i++) {
        var pointAnnotation = private.pointAnnotations[i];
        pointAnnotation.draw();
      }

      for (var i = 0; i < private.rangeAnnotations.length; i++) {
        var rangeAnnotation = private.rangeAnnotations[i];
        rangeAnnotation.draw();
      }
    }

    var showAnnotationInput = function(e, text) {
      if (text !== undefined) {
        $("#annotationInput").val(text);
      }

      $("#annotationInputCont").css("display", "block");

      if (e !== undefined) {
        $("#annotationInputCont").css("left", e.pageX + private.circleRadius + 5 + "px");
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
      var startCoord = private.editorImg.toCanvasCoord(rectangle.startCoord);
      var endCoord = private.editorImg.toCanvasCoord(rectangle.endCoord);

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

    var deleteAnnotation = function() {
      var index;
      // Check point annotations
      index = private.pointAnnotations.indexOf(private.annotation);

      if (index > -1) {
        private.pointAnnotations.splice(index, 1);
        drawImg();
        drawAnnotations();
        if (private.annotation.inDB()) {
          private.annotation.del();
        }

        private.annotation = undefined
        return;
      }

      // Check range annotations
      index = private.rangeAnnotations.indexOf(private.annotation);
      if (index > -1) {
        private.rangeAnnotations.splice(index, 1);
        drawImg();
        drawAnnotations();
        if (private.annotation.inDB()) {
          private.annotation.del();
        }

        private.annotation = undefined
        return;
      }
    }

    return {
      drawImg: drawImg, 
      zoomIn: zoomIn, 
      zoomOut: zoomOut, 
      drawAnnotations: drawAnnotations, 
      showAnnotationInput: showAnnotationInput, 
      hideAnnotationInput: hideAnnotationInput, 
      checkInsideRectangle: checkInsideRectangle, 
      deleteAnnotation: deleteAnnotation
    }
  })();

  // Starts all processes
  var init = function(imgUrl, image_id) {
    setPrivate(imgUrl, image_id);
    imgInit(image_id);

    sizingJS();
    $(window).resize(function() {
      responsiveJS();
    });

    eventListeners();
  }

  var imgInit = function(image_id) {
    
    var img = private.img;

    img.onload = function() {
      helpers.drawImg();
      ajaxController.get('/medImages/' + image_id + '/annotations').done(function(res) {
        for (var i = 0; i < res.length; i++) {
          var annotation = res[i];
          if (annotation.__t == "PointAnnotation") {
            private.pointAnnotations.push(createPointAnnotation(annotation));
          } else if (annotation.__t == "RangeAnnotation") {
            private.rangeAnnotations.push(createRangeAnnotation(annotation));
          }
        }

        helpers.drawAnnotations();
      });
    }
  }

  var sizingJS = function() {
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
                               private.ctx, 
                               private.editorImg, 
                               private.image_id, 
                               private.circleRadius, 
                               dbAnnotation._id);
  }

  var createRangeAnnotation = function(dbAnnotation) {
    return new RangeAnnotation(dbAnnotation.text, 
                               new Coord(dbAnnotation.start_point.x, 
                                         dbAnnotation.start_point.y), 
                               new Coord(dbAnnotation.end_point.x, 
                                         dbAnnotation.end_point.y), 
                               private.ctx, 
                               private.editorImg, 
                               private.image_id, 
                               dbAnnotation._id)
  }

  var eventListeners = function() {

    var annotationClicked = false;

    // Canvas listeners
    (function() {
      var drawing = false;
      var overAnnotation = false;
      var lastEventCoord = new Coord();
      var startCoord;
      var endCoord;

      $("#imageCanvas").on("click", function(e) {
        if (private.editType == "edit") {
          if (overAnnotation) {
            helpers.showAnnotationInput(e);
            annotationClicked = true;
          }
        }
      });

      $("#imageCanvas").on("mousedown", function(e) {

        lastEventCoord = getEventCoord(e);

        
        if (private.editType == "edit") {

        } else if (private.editType == "move") {
          drawing = true;
          private.editorImg.draw();
          helpers.drawAnnotations();
        } else if (private.editType == "annotation") {
          drawing = true;
          startCoord = private.editorImg.toImgCoord(lastEventCoord);
        } else {
          throw new Error("Invalid editType:" + private.editType);
        }
      });

      $("#imageCanvas").on("mousemove", function(e) {
        if (private.editType == "edit") {
          if (!annotationClicked) {
            // Look for point annotations close by first
            for (var i = 0; i < private.pointAnnotations.length; i++) {
              var annotation = private.pointAnnotations[i];
              var canvasCoord = private.editorImg.toCanvasCoord(annotation.coord);

              if (Math.abs(e.offsetX - canvasCoord.x) <= private.circleRadius &&
                  Math.abs(e.offsetY - canvasCoord.y) <= private.circleRadius) {
                var text = annotation.text;
                helpers.showAnnotationInput(e, text);

                private.annotation = annotation;

                overAnnotation = true;

                return;
              }
            }

            // Then look for range annotatations
            for (var i = 0; i < private.rangeAnnotations.length; i++) {
              var annotation = private.rangeAnnotations[i];
              if (helpers.checkInsideRectangle(annotation.rectangle, e.offsetX, e.offsetY)) {
                var text = annotation.text;
                helpers.showAnnotationInput(e, text);

                private.annotation = annotation;
                overAnnotation = true;

                return;
              }
            }

            overAnnotation = false;
            helpers.hideAnnotationInput(annotationClicked);
          }
        } 

        if (drawing) {
          
          if (private.editType == "move") {
            private.editorImg.move(e, lastEventCoord);
            private.editorImg.draw();

            helpers.drawAnnotations();
          } else if (private.editType == "annotation") {

          } else {
            throw new Error("Invalid editType:" + private.editType);
          }

          lastEventCoord = getEventCoord(e);
        }
      });

      $("body").on("mouseup", function(e) {
        
        if (drawing) {
          if (private.editType == "edit") {

          } else if (private.editType == "move") {
            private.editorImg.draw();
            helpers.drawAnnotations();
          } else if (private.editType == "annotation") {
            
            if (private.annotation && private.annotation.text.trim().length == 0) {
              helpers.deleteAnnotation();
              return;
            }

            endCoord = private.editorImg.toImgCoord(lastEventCoord);
            if (Math.abs(startCoord.x - endCoord.x) <= private.circleRadius &&
                Math.abs(startCoord.y - endCoord.y) <= private.circleRadius) {
              
              private.annotation = new PointAnnotation("", endCoord, private.ctx, 
                                                       private.editorImg, private.image_id, 
                                                       private.circleRadius);
              private.pointAnnotations.push(private.annotation);
            } else {
              
              private.annotation = new RangeAnnotation("", startCoord, endCoord, 
                                                       private.ctx, private.editorImg, 
                                                       private.image_id);
              private.rangeAnnotations.push(private.annotation);
            }

            private.annotation.draw();

            // Show input box
            helpers.showAnnotationInput(e, "");
          } else {
            throw new Error("Invalid editType:" + private.editType);
          }

          startCoord = undefined;
          lastEventCoord = getEventCoord(e);
          drawing = false;
        }
      });
    })();

    // Controls
    (function() {

      // Edit type
      var changeEditType = function(editType, mouseType, $this) {
        private.editType = editType;
        $("#imageCanvas").css("cursor", mouseType);
        $(".editTypeBtn").attr("disabled", false)
                         .removeClass("highlight");
        $this.attr("disabled", true).addClass("highlight");
      }

      $("#editBtn").on("click", function() {
        changeEditType("edit", "default", $(this));
      });

      $("#annotationBtn").on("click", function() {
        changeEditType("annotation", "crosshair", $(this));
      });

      $("#moveBtn").on("click", function() {
        changeEditType("move", "move", $(this));
      });


      // Zoom
      $("#zoomInBtn").on("click", function() {
        helpers.zoomIn(0.2);
      });

      $("#zoomOutBtn").on("click", function() {
        helpers.zoomOut(0.2);
      });

      //Annotations delete
      $("#annotationDeleteBtn").on("click", function() {
        helpers.deleteAnnotation();
        annotationClicked = false;
        helpers.hideAnnotationInput();
      });
    })();

    // Input box
    (function() {
      $("#annotationInput").on("keyup", function(e) {
        if (e.keyCode == 13) { // Enter
          if (private.annotation) {
            annotationClicked = false;
            if ($(this).val().trim().length == 0) {
              helpers.deleteAnnotation();

            } else {
              private.annotation.text = $(this).val();
              private.annotation.submit();
            }
            helpers.hideAnnotationInput(annotationClicked);
          }
        } else if (e.keyCode == 27) { // Escape
          if (!private.annotation.inDB()) {
            helpers.deleteAnnotation();
          }
          annotationClicked = false;
          helpers.hideAnnotationInput(annotationClicked);
          private.annotation = undefined;
        }
      });
    })();

    // Tooltips
    $("#zoomInBtn").tooltip({placement: "bottom", title: "Zoom in"})
    $("#zoomOutBtn").tooltip({placement: "bottom", title: "Zoom out"})
    $("#editBtn").tooltip({placement: "bottom", title: "Edit and view annotations"})
    $("#annotationBtn").tooltip({placement: "bottom", title: "Create annotation"})
    $("#moveBtn").tooltip({placement: "bottom", title: "Move image"})
  }

  return {
    public: public, 
    init: init
  }
}