var EditorController = function() {
  
  var debug = function(varName) {
    console.log(varName + ":", eval(varName));
  }

  // Public variables, available outside controller
  var public = {};

  // Private variables, 
  var private = {};

  // Occurs after document.ready
  var setPrivate = function(imgUrl, helpers) {
    private.ctx = $("#imageCanvas")[0].getContext('2d');
    private.img = new Image();
    private.img.src = imgUrl;
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

    var hideAnnotationInput = function() {
      $("#annotationInputCont").css("display", "none");
    }

    return {
      drawImg: drawImg, 
      zoomIn: zoomIn, 
      zoomOut: zoomOut, 
      drawAnnotations: drawAnnotations, 
      showAnnotationInput: showAnnotationInput, 
      hideAnnotationInput: hideAnnotationInput
    }
  })();

  // Starts all processes
  var init = function(imgUrl) {
    setPrivate(imgUrl, helpers);
    imgInit();
    eventListeners();
  }

  var imgInit = function() {
    
    var img = private.img;

    img.onload = function() {
      helpers.drawImg();
    }

    $("#imageCanvas")[0].width = $("#imageCanvas").parent().width();
    $("#imageCanvas")[0].height = $("#imageCanvas").parent().height();
  }

  var eventListeners = function() {

    // Canvas listeners
    (function() {
      var drawing = false;
      var lastEventCoord = new Coord();
      var startCoord;
      var endCoord;

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

          // Look for point annotations close by first
          for (var i = 0; i < private.pointAnnotations.length; i++) {
            var annotation = private.pointAnnotations[i];
            var canvasCoord = private.editorImg.toCanvasCoord(annotation.coord);

            if (Math.abs(e.offsetX - canvasCoord.x) <= private.circleRadius &&
                Math.abs(e.offsetY - canvasCoord.y) <= private.circleRadius) {
              var text = annotation.text;
              helpers.showAnnotationInput(e, text);

              return;
            }
          }

          // Then look for range annotatations
          for (var i = 0; i < private.rangeAnnotations.length; i++) {
            var annotation = private.rangeAnnotations[i];
            if (true) {

              return;
            }
          }

          helpers.hideAnnotationInput();
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
            endCoord = private.editorImg.toImgCoord(lastEventCoord);
            if (Math.abs(startCoord.x - endCoord.x) <= private.circleRadius &&
                Math.abs(startCoord.y - endCoord.y) <= private.circleRadius) {
              
              private.annotation = new PointAnnotation("", endCoord, private.ctx, private.editorImg, private.circleRadius);
              private.pointAnnotations.push(private.annotation);
            } else {
              
              private.annotation = new RangeAnnotation("", startCoord, endCoord, private.ctx, private.editorImg);
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
        $(".editTypeBtn").attr("disabled", false);
        $this.attr("disabled", true);
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
      $("#zoomInBtn").on("click", function(e) {
        helpers.zoomIn(0.2);
      });

      $("#zoomOutBtn").on("click", function(e) {
        helpers.zoomOut(0.2);
      });
    })();

    // Input box
    (function() {
      $("#annotationInput").on("keyup", function(e) {
        if (e.keyCode == 13) { // Enter
          if (private.annotation) {
            private.annotation.setText($(this).val());
            helpers.hideAnnotationInput();
            private.annotation = undefined;
          }
        } else if (e.keyCode == 27) { // Escape
          helpers.hideAnnotationInput();
          private.annotation = undefined;
        }
      });
    })();
  }

  return {
    public: public, 
    init: init
  }
}