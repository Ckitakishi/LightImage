new Vue({
  el: '#paint',
  data: {
    isLoad: false,
    canvasShow: false,
    curPoint: {},
    ctx: "",
    drawing: false,
    aborted: false,
    paintBtn: "Start Paint",
    color: [],
    strokeStyle: {},
    weight: [],
    fillWidth: "regular"
  },
  methods: {
    paint: function () {
      var self = this;
      var canvas = document.getElementById("myCanvas");

      if (self.paintBtn === "Clear") {
        self.ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        // init
        self.isLoad = true;
        self.canvasShow = true;
        self.paintBtn = "Clear";
        self.ctx = canvas.getContext("2d");

        // paint tool init
        self.color = [
          {r: 230, g: 0, b: 18},
          {r: 243, g: 152, b: 0},
          {r: 255, g: 251, b: 0},
          {r: 143, g: 195, b: 31},
          {r: 0, g: 153, b: 68},
          {r: 0, g: 158, b: 150},
          {r: 0, g: 160, b: 233},
          {r: 0, g: 104, b: 183},
          {r: 29, g: 32, b: 136},
          {r: 146, g: 7, b: 131},
          {r: 228, g: 0, b: 127},
          {r: 229, g: 0, b: 79}
        ]
      }

      self.weight = ["light", "regular", "bold"]
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

        this.ctx.strokeStyle = "rgb("
        + self.strokeStyle.r + ", "
        + self.strokeStyle.g + ", "
        + self.strokeStyle.b + ")";
        this.ctx.lineWidth = this.lineWidth;
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
    },
    paintColor: function(e) {
      this.ctx.strokeStyle = "rgb(" + e.r + ", " + e.g + ", " + e.b + ")";
      this.strokeStyle = {
        r: e.r,
        g: e.g,
        b: e.b
      };
    },
    paintWeight: function (e) {
      var self = this;
      self.ctx.lineWidth = e.$index * 2 + 1;
      self.lineWidth = self.ctx.lineWidth;
    }
  }
});