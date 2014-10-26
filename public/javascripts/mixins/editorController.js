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
                                      $("#imageCanvas")[0], 
                                      helpers);
    private.editType = "point";
  }

  // Helper functions
  var helpers = (function() {

    var drawImg = function() {

      private.editorImg.draw(private.ctx, $("#imageCanvas"));
    }

    var getEventCoord = function(e) {
      
      var currentX, currentY;

      if(e.offsetX !== undefined){
        currentX = e.offsetX;
        currentY = e.offsetY;
      } else { // Firefox compatibility
        currentX = e.layerX - e.currentTarget.offsetLeft;
        currentY = e.layerY - e.currentTarget.offsetTop;
      }

      return new Coord(currentX,currentY);
    }

    return {
      drawImg: drawImg, 
      getEventCoord: getEventCoord
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

      $("#imageCanvas").on("mousedown", function(e) {
        
        lastEventCoord = helpers.getEventCoord(e);

        if (private.editType == "move") {
          private.editorImg.draw();
          drawing = true;
        } else if (private.editType == "point") {

        } else if (private.editType == "range") {

        } else {
          throw new Error("Invalid editType");
        }
      });

      $("#imageCanvas").on("mousemove", function(e) {
        if (drawing) {
          if (private.editType == "move") {
            private.editorImg.move(e, lastEventCoord);
            lastEventCoord = helpers.getEventCoord(e);
            private.editorImg.draw();
          } else if (private.editType == "point") {

          } else if (private.editType == "range") {

          } else {
            throw new Error("Invalid editType");
          }
        }
      });

      $("#imageCanvas").on("mouseup", function(e) {
        drawing = false;
      })
    })();

    // Controls
    (function() {

      // Edit type
      $("#pointBtn").on("click", function() {
        private.editType = "point";
        $("#imageCanvas").css("cursor", "crosshair");
        $(".editTypeBtn").attr("disabled", false);
        $(this).attr("disabled", true);
      });

      $("#rangeBtn").on("click", function() {
        private.editType = "range";
        $("#imageCanvas").css("cursor", "crosshair");
        $(".editTypeBtn").attr("disabled", false);
        $(this).attr("disabled", true);
      });

      $("#moveBtn").on("click", function() {
        private.editType = "move";
        $("#imageCanvas").css("cursor", "move");
        $(".editTypeBtn").attr("disabled", false);
        $(this).attr("disabled", true);
      });


      // Zoom
      $("#zoomInBtn").on("click", function(e) {
        private.editorImg.zoomIn(0.15);
      });

      $("#zoomOutBtn").on("click", function(e) {
        private.editorImg.zoomOut(0.15);
      });
    })();
  }

  return {
    public: public, 
    init: init
  }
}