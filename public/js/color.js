new Vue({
  el: '#color-analysis',
  data: {
    pixelColor: "",
    ctx: "",
    hasImage: false,
    r: 255,
    g: 255,
    b: 255,
    pixels: [],
    curPixels: [],
    topWidth: 0,
    canvasShow: false,
    colorsLen: 0,
    pixelsLen: 0
  },
  created: function() {

  },
  filters: {
    sort: function (colors) {

      function compare(v1, v2) {
        if (v1.n < v2.n) {
          return 1;
        } else if (v1.n > v2.n) {
          return -1;
        } else {
          return 0;
        }
      }
      if (colors.length > 0) {
        colors.sort(compare);
        this.topWidth = colors[0].n / 100;

        // 排序并显示一部分
        if (this.colorsLen === colors.length) {
          var i = 1;
          while (colors[i].n * 500 > this.pixelsLen) {
            i++;
          }
          colors.splice(i, colors.length - i);
        }
      }

      return colors;
    }
  },
  methods: {
    analysis: function() {
      var canvas = document.getElementById("myCanvas");
      var image = document.getElementById("image-source");

      if (image.style.display === "none") {
        console.log("请上传图片");
        return;
      }

      this.canvasShow = true;
      this.hasImage = true;
      canvas.width  = image.width;
      canvas.height = image.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      this.ctx = ctx;

      this.$broadcast("imageHide");
      this.colorInfo(canvas, ctx);
    },
    pixelInfo: function (e) {
      if (this.hasImage === true) {
        var x = e.layerX;
        var y = e.layerY;
        var pixel = this.ctx.getImageData(x, y, 1, 1);
        var data = pixel.data;
        this.r = data[0];
        this.g = data[1];
        this.b = data[2];
        var rgba = 'rgba(' + data[0] + ',' + data[1] +
          ',' + data[2] + ',' + data[3] + ')';
        this.pixelColor = rgba;
      }
    },
    colorInfo: function (canvas, ctx) {
      var self = this;
      self.pixels = new Array(216);

      // 51.....216
      function getColor(col) {
        if (col % 51 <= 25) {
          return (col - col % 51) / 51;
        } else {
          return (col - col % 51) / 51 + 1;
        }
      }

      var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var data = canvasData.data;
      var r, g, b;
      var i, len;

      for (i = 0, len = data.length; i < len; i+=4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];

        r = getColor(r);
        g = getColor(g);
        b = getColor(b);

        // TODO: 优化
        // 方案一： 将216种情况分别对应不同的颜色值[[ using
        // 方案二： 每种颜色为Key，对应不同的value表示出现的次数[[ 效率...
        // 方案三： ...

        //rgb = r.toString() + g.toString() + b.toString();
        //for (j = 0, jlen = self.pixels.length; j < jlen; j++) {
        //  if (self.pixels[j] === rgb) {
        //    self.pixels.value++;
        //    break;
        //  }
        //  if (j === jlen-1) {
        //    pixel.key = rgb;
        //    pixel.value = 1;
        //    self.pixels.push(pixel);
        //  }
        //}
        //
        //if (self.pixels.length === 0) {
        //  pixel.key = rgb;
        //  pixel.value = 1;
        //  self.pixels.push(pixel);
        //}

        var index = r * 36 + g * 6 + b;

        if (self.pixels[index]) {
          self.pixels[index]++;
        } else {
          self.pixels[index] = 1;
        }
      }
      self.pixelsLen = len/4;
      ctx.putImageData(canvasData, 0, 0); // at coords 0,0

      var curPixel = {};
      self.curPixels = [];
      for (i = 0; i < 216; i++) {
        if (self.pixels[i]) {
          curPixel = {};
          curPixel.r = Math.floor((i / 36)) * 51;
          curPixel.g = Math.floor((i % 36) / 6) * 51;
          curPixel.b = ((i % 36) % 6) * 51;
          curPixel.n = self.pixels[i];
          self.curPixels.push(curPixel);
        }
      }

      self.colorsLen = self.curPixels.length;
    }
  }
});