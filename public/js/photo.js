// TODO: 代码优化，像素处理过程
new Vue({
  el: '#photo',
  data: {
    isLoad: false,
    canvasShow: false,
    hasImage: false,
    canvasData: "",
    ctx: "",
    initial: false,
    imageWidth: 0,
    imageHeight: 0
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

      if (self.imageWidth) {
        canvas.width  = self.imageWidth;
        canvas.height = self.imageHeight;
      } else {
        self.imageWidth = image.width;
        self.imageHeight = image.height;
        canvas.width  = image.width;
        canvas.height = image.height;
      }

      self.ctx = canvas.getContext("2d");
      self.ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      self.canvasData = self.ctx.getImageData(0, 0, canvas.width, canvas.height);

      self.initial = true;
    },
    normlize: function (kernel) {
      var len = kernel.length;
      var normal = new Array(len);
      var i, sum = 0;
      for (i = 0; i < len; ++i) {
        sum += kernel[i];
      }
      if (sum <= 0) {
        normal.normalized = false;
        sum = 1;
      } else {
        normal.normalized = true;
      }
      for (i = 0; i < len; ++i) {
        normal[i] = kernel[i] / sum;
      }
      return normal;
    },
    convolve: function (kernel) {
      // 参考：http://openlayers.org/en/master/examples/image-filter.html?mode=advanced
      var size = Math.sqrt(kernel.length);
      var half = Math.floor(size / 2);

      var width = this.canvasData.width;
      var height = this.canvasData.height;
      var inputData = this.canvasData.data;

      var output = this.ctx.createImageData(width, height);
      var outputData = output.data;

      for (var pixelY = 0; pixelY < height; ++pixelY) {
        var pixelsAbove = pixelY * width;
        for (var pixelX = 0; pixelX < width; ++pixelX) {
          var r = 0, g = 0, b = 0, a = 0;
          for (var kernelY = 0; kernelY < size; ++kernelY) {
            for (var kernelX = 0; kernelX < size; ++kernelX) {
              var weight = kernel[kernelY * size + kernelX];
              var neighborY = Math.min(
                height - 1, Math.max(0, pixelY + kernelY - half));
              var neighborX = Math.min(
                width - 1, Math.max(0, pixelX + kernelX - half));
              var inputIndex = (neighborY * width + neighborX) * 4;
              r += inputData[inputIndex] * weight;
              g += inputData[inputIndex + 1] * weight;
              b += inputData[inputIndex + 2] * weight;
              a += inputData[inputIndex + 3] * weight;
            }
          }
          var outputIndex = (pixelsAbove + pixelX) * 4;
          outputData[outputIndex] = r;
          outputData[outputIndex + 1] = g;
          outputData[outputIndex + 2] = b;
          outputData[outputIndex + 3] = kernel.normalized ? a : 255;
        }
      }
      this.ctx.putImageData(output, 0, 0);
      this.$broadcast("imageHide");
    },
    gray: function() {
      if (!this.initial) {
        this.initCanvas();
      }
      var canvasData = this.canvasData;
      var data = canvasData.data;
      var r, g, b, a;

      var output = this.ctx.createImageData(canvasData.width, canvasData.height);
      var outputData = output.data;

      for (var i = 0, len = data.length; i < len; i+=4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];
        a = data[i + 3];

        var gray = .299 * r + .587 * g + .114 * b;

        outputData[i] = gray;
        outputData[i + 1] = gray;
        outputData[i + 2] = gray;
        outputData[i + 3] = a;
      }
      this.ctx.putImageData(output, 0, 0); // at coords 0,0

      this.$broadcast("imageHide");
    },
    blackwhite: function () {
      if (!this.initial) {
        this.initCanvas();
      }
      var canvasData = this.canvasData;
      var data = canvasData.data;
      var r, g, b, a;

      var output = this.ctx.createImageData(canvasData.width, canvasData.height);
      var outputData = output.data;

      for (var i = 0, len = data.length; i < len; i+=4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];
        a = data[i + 3];

        if ((r + b + g) / 3 > 128) {
          outputData[i] = 255;
          outputData[i + 1] = 255;
          outputData[i + 2] = 255;
        } else {
          outputData[i] = 0;
          outputData[i + 1] = 0;
          outputData[i + 2] = 0;
        }
        outputData[i + 3] = a;
      }
      this.ctx.putImageData(output, 0, 0);

      // TODO: ....
      this.$broadcast("imageHide");
    },
    reversal: function () {
      if (!this.initial) {
        this.initCanvas();
      }
      var canvasData = this.canvasData;
      var data = canvasData.data;
      var r, g, b, a;

      var output = this.ctx.createImageData(canvasData.width, canvasData.height);
      var outputData = output.data;

      for (var i = 0, len = data.length; i < len; i+=4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];
        a = data[i + 3];

        outputData[i] = 255 - r;
        outputData[i + 1] = 255 - g;
        outputData[i + 2] = 255 - b;
        outputData[i + 3] = a;
      }
      this.ctx.putImageData(output, 0, 0);

      this.$broadcast("imageHide");
    },
    emboss: function () {
      // TODO: 边缘的处理。可以考虑对称
      if (!this.initial) {
        this.initCanvas();
      }
      var canvasData = this.canvasData;
      var data = canvasData.data;
      var r, g, b, a;
      var prer = 128, preg = 128, preb = 128;

      var output = this.ctx.createImageData(canvasData.width, canvasData.height);
      var outputData = output.data;

      for (var i = 0, len = data.length; i < len; i+=4) {
        r = data[i] - prer + 128;
        g = data[i + 1] - preg + 128;
        b = data[i + 2] - preb + 128;
        a = data[i + 3];

        prer = data[i];
        preg = data[i + 1];
        preb = data[i + 2];

        var gray = .299 * r + .587 * g + .114 * b;

        outputData[i] = gray;
        outputData[i + 1] = gray;
        outputData[i + 2] = gray;
        outputData[i + 3] = a;
      }
      this.ctx.putImageData(output, 0, 0); // at coords 0,0

      this.$broadcast("imageHide");
    },
    sharp: function () {
      if (!this.initial) {
        this.initCanvas();
      }
      // Laplace算子
      var sharpKernel = [
        -1, -1, -1,
        -1, 9, -1,
        -1, -1, -1
      ];

      var selectedKernel = this.normlize(sharpKernel);
      this.convolve(selectedKernel);
    },
    blur: function() {
      if (!this.initial) {
        this.initCanvas();
      }

      var blurKernel = [
        1, 1, 1,
        1, 1, 1,
        1, 1, 1
      ];
      var selectedKernel = this.normlize(blurKernel);
      this.convolve(selectedKernel);
    },
    gaussianBlur: function() {216081938
      if (!this.initial) {
        this.initCanvas();
      }

      var blurKernel = [
        1, 2, 1,
        2, 4, 2,
        1, 2, 1
      ];
      var selectedKernel = this.normlize(blurKernel);
      this.convolve(selectedKernel);
    },

  //  ----------------------- 几何变换 ------------------------

    hSymmetry: function () {
      // 方案一： 交换对应像素
      // 方案二： 映射, [-1,0,0,0,1,0,width-1,0,1];
      if (!this.initial) {
        this.initCanvas();
      }

      var canvasData = this.canvasData;
      var data = canvasData.data;
      var w = canvasData.width, h = canvasData.height;
      var i, j, k;

      var output = this.ctx.createImageData(w, h);
      var outputData = output.data;

      for (i = 0; i < h; i++) {
        for (j = 0; j < w / 2; j++) {
          for (k = 0; k < 4; k++) {
            outputData[w * i * 4 + (w - j - 1) * 4 + k] = data[w * i * 4 + j * 4 + k];
            outputData[w * i * 4 + j * 4 + k] = data[w * i * 4 + (w - j - 1) * 4 + k];
          }
        }
      }
      this.ctx.putImageData(output, 0, 0); // at coords 0,0

      this.$broadcast("imageHide");
    },
    vSymmetry: function () {
      if (!this.initial) {
        this.initCanvas();
      }
      var canvasData = this.canvasData;
      var data = canvasData.data;
      var w = canvasData.width, h = canvasData.height;
      var i, j, k;

      var output = this.ctx.createImageData(w, h);
      var outputData = output.data;

      for (i = 0; i < h / 2; i++) {
        for (j = 0; j < w; j++) {
          for (k = 0; k < 4; k++) {
            outputData[w * i * 4 + j * 4 + k] = data[w * (h - i - 1) * 4 + j * 4 + k];
            outputData[w * (h - i - 1) * 4 + j * 4 + k] = data[w * i * 4 + j * 4 + k];
          }
        }
      }
      this.ctx.putImageData(output, 0, 0); // at coords 0,0

      this.$broadcast("imageHide");
    },
    rotation: function () {
      if (!this.initial) {
        this.initCanvas();
      }

      var canvas = document.getElementById("myCanvas");
      this.initial = false;

      var canvasData = this.canvasData;
      var data = canvasData.data;
      var w = canvasData.width, h = canvasData.height;
      var i, j, k;

      canvas.width = h;
      canvas.height = w;

      var output = this.ctx.createImageData(canvas.width, canvas.height);
      var outputData = output.data;

      // 方案一： 像素处理
      // 方案二： rotate方法
      for (i = 0; i < h; i++) {
        for (j = 0; j < w; j++) {
          for (k = 0; k < 4; k++) {
            // 顺90
            outputData[h * j * 4 + (h - i - 1)* 4 + k] = data[w * i * 4 + j * 4 + k];
          }
        }
      }
      this.ctx.putImageData(output, 0, 0);
      this.$broadcast("imageHide");
    },
    antiRotation: function () {
      if (!this.initial) {
        this.initCanvas();
      }

      var canvas = document.getElementById("myCanvas");
      this.initial = false;

      var canvasData = this.canvasData;
      var data = canvasData.data;
      var w = canvasData.width, h = canvasData.height;
      var i, j, k;

      canvas.width = h;
      canvas.height = w;

      var output = this.ctx.createImageData(canvas.width, canvas.height);
      var outputData = output.data;

      for (i = 0; i < h; i++) {
        for (j = 0; j < w; j++) {
          for (k = 0; k < 4; k++) {
            // 逆90
            outputData[h * (w - j -1) * 4 + i * 4 + k] = data[w * i * 4 + j * 4 + k];
          }
        }
      }
      this.ctx.putImageData(output, 0, 0);
      this.$broadcast("imageHide");
    },
    allRotation: function() {
      if (!this.initial) {
        this.initCanvas();
      }

      var canvasData = this.canvasData;
      var data = canvasData.data;
      var w = canvasData.width, h = canvasData.height;
      var i, j, k;

      var output = this.ctx.createImageData(w, h);
      var outputData = output.data;

      for (i = 0; i < h; i++) {
        for (j = 0; j < w; j++) {
          for (k = 0; k < 4; k++) {
            // 逆90
            outputData[(h - i - 1) * w * 4 + (w - j - 1) * 4 + k] = data[w * i * 4 + j * 4 + k];
          }
        }
      }
      this.ctx.putImageData(output, 0, 0);
      this.$broadcast("imageHide");
    }
  },
  events: {
    loaded: function () {
      this.isLoad = true;
    }
  }
});