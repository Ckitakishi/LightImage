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
    isLoad: false,
    colorsLen: 0,
    pixelsLen: 0
  },
  created: function() {

  },
  filters: {
    sort: function (colors) {

      //function compare(v1, v2) {
      //  if (v1.n < v2.n) {
      //    return 1;
      //  } else if (v1.n > v2.n) {
      //    return -1;
      //  } else {
      //    return 0;
      //  }
      //}
      function compare(v1, v2) {
        return v2.n - v1.n;
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
      this.histogram(canvas, ctx);
    },
    pixelInfo: function (e) {
      if (this.hasImage) {
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

      // convert RGB to HSL
      function convertToHSL(rr, gg, bb) {
        var cMax, cMin, delta;
        var h, s, l;
        if (rr >= gg) {
          cMax = rr;
          cMin = gg;
        } else {
          cMax = gg;
          cMin = rr;
        }
        if (cMax >= bb) {
          if (cMin > bb) {
            cMin = bb;
          }
        } else {
          cMax = bb;
        }

        // 浮点数计算bug。
        delta = (cMax * 100 - cMin * 100) / 100;
        if (delta === 0) {
          h = 0;
        } else if (cMax === rr) {
          h = 60 * (((gg - bb) / delta) % 6);
        } else if (cMax === gg) {
          h = 60 * (((bb - rr) / delta) + 2);
        } else if (cMax === bb) {
          h = 60 * (((rr - gg) / delta) + 4);
        }
        h = Math.floor(h);

        l = (cMax + cMin) / 2;

        if (delta === 0) {
          s = 0;
        } else {
          s = delta * 100 / (100 - Math.abs(2 * l - 1) * 100);
        }
        s = Math.floor(s * 100);
        l = Math.floor(l * 100);
        return "hsl(" + h.toString() + "º," + s.toString() + "%," + l.toString() + "%)";
      }

      function convertToCMYK(rr, gg, bb) {
        var cMax;
        var c, m, y, k;
        if (rr >= gg) {
          cMax = rr;
        } else {
          cMax = gg;
        }
        if (cMax < bb) {
          cMax = bb;
        }

        // 浮点数计算bug。
        k = (100 - cMax * 100) / 100;
        if (k === 1) {
          c = 0;
          m = 0;
          y = 0;
        } else {
          c = (1 - rr - k) / (1 - k);
          m = (1 - gg - k) / (1 - k);
          y = (1 - bb - k) / (1 - k);
          if (c > 0) {
            c = c.toFixed(2);
          } else {
            c = 0;
          }
          if (m > 0) {
            m = m.toFixed(2);
          }else {
            m = 0;
          }
          if (y > 0) {
            y = y.toFixed(2);
          }else {
            y = 0;
          }
        }
        return "cmyk(" + c.toString() + "," + m.toString() + "," + y.toString() + "," + k.toString() + ")";
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
      //ctx.putImageData(canvasData, 0, 0); // at coords 0,0

      var curPixel = {};
      self.curPixels = [];
      for (i = 0; i < 216; i++) {
        if (self.pixels[i]) {
          curPixel = {};
          curPixel.r = Math.floor((i / 36)) * 51;
          curPixel.g = Math.floor((i % 36) / 6) * 51;
          curPixel.b = ((i % 36) % 6) * 51;
          curPixel.n = self.pixels[i];
          curPixel.hsl = convertToHSL(curPixel.r / 255, curPixel.g / 255, curPixel.b / 255);
          curPixel.cmyk = convertToCMYK(curPixel.r / 255, curPixel.g / 255, curPixel.b / 255);
          self.curPixels.push(curPixel);
        }
      }

      self.colorsLen = self.curPixels.length;
    },
    /**
     * 生成直方图
     */
    histogram : function (canvas, ctx) {
      var histogramCanvas = document.getElementById("histogram");
      var hisCtx = histogramCanvas.getContext("2d");

      var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var data = canvasData.data;
      var r, g, b;
      var grayArr = [];

      // 灰度的统计
      for (var i = 0, len = data.length; i < len; i+=4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];

        var gray = Math.round(.299 * r + .587 * g + .114 * b);
        if (grayArr[gray]) {
          grayArr[gray] ++;
        } else {
          grayArr[gray] = 1;
        }
      }

      // 找到最大值，考虑优化
      var hisWidth = histogramCanvas.width,
        hisHeight = histogramCanvas.height;
      var max = 0;
      grayArr.forEach(function (ele) {
        if (ele > max) {
          max = ele;
        }
      });

      var fre = hisHeight / max;

      // 绘制直方图
      var y;
      hisCtx.strokeStyle = "gray";
      hisCtx.lineWidth = hisWidth / 256;
      hisCtx.beginPath();
      grayArr.forEach(function (ele, index) {
        if (ele) {
          y = hisHeight - ele * fre;
        } else {
          y = 0;
        }
        hisCtx.moveTo(index * hisCtx.lineWidth, hisHeight);
        hisCtx.lineTo(index * hisCtx.lineWidth, y);
        hisCtx.stroke();
      });
      hisCtx.closePath();

      var dataLen = data.length / 4;
      this.histogramEqual(grayArr, dataLen);
    },
    histogramEqual: function(grayArr, dataLen) {
      var cdfMin = grayArr[0] || 0;
      var cdf = 0, h;
      var equalArr = [];
      grayArr.forEach(function (ele) {
        cdf += ele;
        h = Math.round(((cdf - cdfMin) / (dataLen - cdfMin)) * 255);
        if (equalArr[h]) {
          equalArr[h] += ele;
        } else {
          equalArr[h] = ele;
        }
      });

      var max = 0;
      equalArr.forEach(function (ele) {
        if (ele > max) {
          max = ele;
        }
      });

      // 绘制直方图均衡化后
      var equalCanvas = document.getElementById("histogram-equal");
      var equalCtx = equalCanvas.getContext("2d");
      var equalWidth = equalCanvas.width,
        equalHeight = equalCanvas.height;
      var y;
      var fre = equalHeight / max;

      equalCtx.strokeStyle = "gray";
      equalCtx.lineWidth = equalWidth / 256;
      equalCtx.beginPath();
      equalArr.forEach(function (ele, index) {
        if (ele) {
          y = equalHeight - ele * fre;
        } else {
          y = 0;
        }
        equalCtx.moveTo(index * equalCtx.lineWidth, equalHeight);
        equalCtx.lineTo(index * equalCtx.lineWidth, y);
        equalCtx.stroke();
      });
      equalCtx.closePath();
    }
  },
  events: {
    loaded: function () {
      this.isLoad = true;
    }
  }
});