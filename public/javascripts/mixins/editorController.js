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
    private.pointAnnotations = {};
    private.rangeAnnotations = {};
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
      var pointAnnotationsKeys = Object.keys(private.pointAnnotations);
      var rangeAnnotationsKeys = Object.keys(private.rangeAnnotations);

      for (var i = 0; i < pointAnnotationsKeys.length; i++) {
        var pointAnnotation = private.pointAnnotations[pointAnnotationsKeys[i]];
        pointAnnotation.draw();
      }

      for (var i = 0; i < rangeAnnotationsKeys.length; i++) {
        var rangeAnnotation = private.rangeAnnotations[rangeAnnotationsKeys[i]];
        rangeAnnotation.draw();
      }
    }

    return {
      drawImg: drawImg, 
      zoomIn: zoomIn, 
      zoomOut: zoomOut, 
      drawAnnotations: drawAnnotations
    }
  })();

  // Starts all processes
  var init = function(imgUrl) {
    console.log('EditorController initialized');

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
        if (drawing) {
          
          if (private.editType == "edit") {

          } else if (private.editType == "move") {
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
            var annotation;
            endCoord = private.editorImg.toImgCoord(lastEventCoord);
            if (Math.abs(startCoord.x - endCoord.x) <= private.circleRadius &&
                Math.abs(startCoord.y - endCoord.y) <= private.circleRadius) {
              annotation = new PointAnnotation("", endCoord, private.ctx, private.editorImg, private.circleRadius);
              private.pointAnnotations[endCoord.x + "-" + endCoord.y] = annotation;

              console.log("pointAnnotation");
            } else {
              annotation = new RangeAnnotation("", startCoord, endCoord, private.ctx, private.editorImg);
              private.rangeAnnotations[startCoord.x + "-" + startCoord.y + "," 
                                     + endCoord.x + "-" + endCoord.y] = annotation;
            }

            annotation.draw();
          } else {
            throw new Error("Invalid editType:" + private.editType);
          }

          startCoord = undefined;
          annotation = undefined;
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
  }

  return {
    public: public, 
    init: init
  }
}