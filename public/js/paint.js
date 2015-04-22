new Vue({
  el: '#paint',
  data: {
    isLoad: false,
    canvasShow: false,
    curPoint: {},
    ctx: "",
    drawing: false,
    aborted: false,
    paintBtn: "Start Paint"
  },
  methods: {
    paint: function () {
      this.isLoad = true;
      this.canvasShow = true;
      this.paintBtn = "Clear";

      var canvas = document.getElementById("myCanvas");
      this.ctx = canvas.getContext("2d");
    },
    drawPathStart: function (e) {
      var self = this;
      var px = e.layerX;
      var py = e.layerY;

      function isEmpty(obj)
      {
        for(var x in obj)
        {
          if(obj.hasOwnProperty(x))
          {
            return false;
          }
        }
        return true;
      }

      if (isEmpty(self.curPoint)) {
        var canvas = document.getElementById("myCanvas");

        var height = canvas.offsetHeight;
        var width = canvas.offsetWidth;

        canvas.height = height;
        canvas.width = width;
        self.ctx = canvas.getContext("2d");
      }

      self.curPoint.x = px;
      self.curPoint.y = py;
      self.ctx.beginPath();

      self.drawing = true;
    },
    drawPath: function(e) {
      var self = this;
      var px, py;

      if (self.drawing) {
        self.ctx.fillStyle = 'red';
        px = e.layerX;
        py = e.layerY;

        self.ctx.moveTo(self.curPoint.x, self.curPoint.y);
        self.ctx.lineTo(px, py);
        self.ctx.stroke();
        self.ctx.closePath();
        self.curPoint.x = px;
        self.curPoint.y = py;
      }
    },
    drawPathEnd: function() {
      this.drawing = false;
    },
    drawPathAbort: function () {
      //this.drawing = false;
      this.aborted = true;
    },
    drawPathContinue: function (e) {
      var self = this;

      if (self.aborted && self.drawing) {
        var px = e.layerX;
        var py = e.layerY;

        self.curPoint.x = px;
        self.curPoint.y = py;
        self.ctx.beginPath();
        self.drawing = true;
      }
    }
  }
});