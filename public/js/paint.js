// TODO: mouse事件，应该只有左键，待修正，以及，添加touch事件。

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
    fillStyle: {},
    weight: [],
    fillWidth: "regular",
    drawPixel: false,
    multiple: 30
  },
  methods: {
    paint: function () {
      var self = this;
      if (self.paintBtn === "Clear") {
        var canvas;
        if (self.drawPixel) {
          canvas = document.getElementById("pixelCanvas");
        } else {
          canvas = document.getElementById("myCanvas");
        }
        self.ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        // init
        self.isLoad = true;
        self.canvasShow = true;
        self.paintBtn = "Clear";
        self.drawPixel = false;

        // paint tool init
        self.color = [
          {r: 230, g: 0, b: 18},
          {r: 243, g: 152, b: 0},
          {r: 255, g: 251, b: 0},
          {r: 255, g: 255, b: 255},
          {r: 143, g: 195, b: 31},
          {r: 0, g: 153, b: 68},
          {r: 0, g: 158, b: 150},
          {r: 0, g: 160, b: 233},
          {r: 0, g: 104, b: 183},
          {r: 29, g: 32, b: 136},
          {r: 0, g: 0, b: 0},
          {r: 146, g: 7, b: 131},
          {r: 228, g: 0, b: 127},
          {r: 229, g: 0, b: 79}
        ]
      }
      self.weight = ["light", "regular", "bold"];
    },
    drawPixel: function () {
      this.paint();
      this.drawPixel = true;
      this.multiple = 30;
    },
    drawPathStart: function (e) {
      if (e.which !== 1) {
        return;
      }
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
        self.curPoint.x = px;
        self.curPoint.y = py;
      }
    },
    drawPathEnd: function() {
      this.drawing = false;
      if (!this.drawPixel) {
        this.ctx.closePath();
      }
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
      if (this.drawPixel) {
        this.ctx.fillStyle = "rgb(" + e.r + ", " + e.g + ", " + e.b + ")";
        this.fillStyle = {
          r: e.r,
          g: e.g,
          b: e.b
        };
      } else {
        this.ctx.strokeStyle = "rgb(" + e.r + ", " + e.g + ", " + e.b + ")";
        this.strokeStyle = {
          r: e.r,
          g: e.g,
          b: e.b
        };
      }
    },
    paintWeight: function (e) {
      var self = this;
      self.ctx.lineWidth = e.$index * 2 + 1;
      self.lineWidth = self.ctx.lineWidth;
    },
    pixelSize: function(index) {
      // TODO: magic number，需修改。
      var self = this;

      self.multiple = 480 / ((index + 1) * 16);
      var canvas = document.getElementById("pixelCanvas");
      canvas.height = 480;
      canvas.width = 480;

      self.ctx = canvas.getContext("2d");
      self.ctx.imageSmoothingEnabled = false;
    },
    pixelStart: function (e) {
      // left mouse button : 1
      if (e.which !== 1) {
        return;
      }
      var self = this;
      var cx, cy;
      var px = e.layerX;
      var py = e.layerY;

      self.curPoint.x = px;
      self.curPoint.y = py;

      cx = Math.floor(px / self.multiple) * self.multiple;
      cy = Math.floor(py / self.multiple) * self.multiple;

      if (!self.ctx) {
        // 默认值：16*16
        var canvas = document.getElementById("pixelCanvas");
        canvas.height = 480;
        canvas.width = 480;

        self.ctx = canvas.getContext("2d");
      }

      self.ctx.rect(cx, cy, self.multiple, self.multiple);
      self.ctx.fillRect(cx, cy, self.multiple, self.multiple);

      self.drawing = true;
    },
    pixel: function(e) {
      var self = this;
      var px, py, cx, cy;

      if (self.drawing) {
        px = e.layerX;
        py = e.layerY;

        cx = Math.floor(px / self.multiple) * self.multiple;
        cy = Math.floor(py / self.multiple) * self.multiple;

        self.ctx.rect(cx, cy, self.multiple, self.multiple);
        self.ctx.fillRect(cx, cy, self.multiple, self.multiple);

        self.curPoint.x = px;
        self.curPoint.y = py;ti
      }
    }
  }
});