// TODO: 代码优化，像素处理过程
new Vue({
  el: '#photo',
  data: {
    isLoad: false,
    canvasShow: false,
    hasImage: false,
    canvasData: "",
    ctx: "",
    initial: false
  },
  created: function() {
    console.log("create");
  },
  methods: {
    initCanvas: function () {
      var self = this;
      var canvas = document.getElementById("myCanvas");
      var image = document.getElementById("image-source");

      self.canvasShow = true;
      self.hasImage = true;

      canvas.width  = image.width;
      canvas.height = image.height;

      self.ctx = canvas.getContext("2d");
      self.ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      self.canvasData = self.ctx.getImageData(0, 0, canvas.width, canvas.height);

      self.initial = true;
    },
    gray: function() {
      if (!this.initial) {
        this.initCanvas();
      }
      var canvasData = this.canvasData;
      var data = canvasData.data;
      var r, g, b, a;

      for (var i = 0, len = data.length; i < len; i+=4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];
        a = data[i + 3];

        var gray = .299 * r + .587 * g + .114 * b;

        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }
      this.ctx.putImageData(canvasData, 0, 0); // at coords 0,0

      this.$broadcast("imageHide");
    },
    blackwhite: function () {
      if (!this.initial) {
        this.initCanvas();
      }
      var canvasData = this.canvasData;
      var data = canvasData.data;
      var r, g, b;

      for (var i = 0, len = data.length; i < len; i+=4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];

        if ((r + b + g) / 3 > 128) {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        } else {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
        }
      }
      this.ctx.putImageData(canvasData, 0, 0);

      // TODO: ....
      this.$broadcast("imageHide");
    },
    reversal: function () {
      if (!this.initial) {
        this.initCanvas();
      }
      var canvasData = this.canvasData;
      var data = canvasData.data;
      var r, g, b;

      for (var i = 0, len = data.length; i < len; i+=4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];

        data[i] = 255 - r;
        data[i + 1] = 255 - g;
        data[i + 2] = 255 - b;
      }
      this.ctx.putImageData(canvasData, 0, 0);

      this.$broadcast("imageHide");
    },
    emboss: function () {
      // TODO: 边缘的处理。可以考虑对称
      if (!this.initial) {
        this.initCanvas();
      }
      var canvasData = this.canvasData;
      var data = canvasData.data;
      var r, g, b;
      var prer = 128, preg = 128, preb = 128;

      for (var i = 0, len = data.length; i < len; i+=4) {
        r = data[i] - prer + 128;
        g = data[i + 1] - preg + 128;
        b = data[i + 2] - preb + 128;

        prer = data[i];
        preg = data[i + 1];
        preb = data[i + 2];

        var gray = .299 * r + .587 * g + .114 * b;

        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }
      this.ctx.putImageData(canvasData, 0, 0); // at coords 0,0

      this.$broadcast("imageHide");
    },
    sharp: function () {
      // Laplace算子？
      // 相邻像素
      if (!this.initial) {
        this.initCanvas();
      }
      var canvasData = this.canvasData;
      var data = canvasData.data;
      var r, g, b;
      var prer = 128, preg = 128, preb = 128;

      for (var i = 0, len = data.length; i < len; i+=4) {
        r = data[i] + 0.25 * Math.abs(data[i] - prer);
        g = data[i + 1] + 0.25 * Math.abs(data[i + 1] - preg);
        b = data[i + 2] + 0.25 * Math.abs(data[i + 2] - preb);

        prer = data[i];
        preg = data[i + 1];
        preb = data[i + 2];


        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }
      this.ctx.putImageData(canvasData, 0, 0); // at coords 0,0

      this.$broadcast("imageHide");
    },
    blur: function() {
      //[1,1,1,
      //1,1,1,
      //1,1,1]
    }
  },
  events: {
    loaded: function () {
      this.isLoad = true;
    }
  }
});