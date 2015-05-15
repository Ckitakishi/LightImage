Vue.component('crop-component', {
  template: '#temp-crop',
  data: function () {
    return {
      imageInfo: {},
      height: 0,
      width: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      curInfo: {},
      downPos: "",
      dragPoint: {}
    }
  },
  created: function () {
    var preview = document.getElementById("preview");
    this.width = preview.width;
    this.height = preview.height;
    //this.previewInfo = {
    //  nw: preview.getBoundingClientRect().right - preview.getBoundingClientRect().left
    //};
    this.imageInfo = {
      width: preview.width,
      height: preview.height
    }
  },
  methods: {
    resizeNarrow: function (e) {
      var x = e.layerX, y = e.layerY;
      this.top += y;
      this.left += x;
      this.width -= x;
      this.height -= y;
    },
    resizeZoom: function (e) {
      var x = e.layerX, y = e.layerY;
      this.width = this.imageInfo.width - x;
      this.height = this.imageInfo.height - y;
      this.top = y;
      this.left = x;
    },
    leftTopDown: function () {
      var self = this;
      var preview = document.getElementById("preview");
      self.downPos = "nw";
      var nwResize = function(e) {
        self.resizeNarrow(e);
      };
      var test = function (e) {
        self.resizeZoom(e);
      };
      self.$el.addEventListener("mousemove", nwResize, false);
      preview.addEventListener("mousemove", test, false);
      //self.$el.addEventListener("mouseup", function () {
      //  self.$el.removeEventListener("mousemove", test, false);
      //});
      // TODO: 暂时先设为windows
      window.addEventListener("mouseup", function () {
        self.$el.removeEventListener("mousemove", nwResize, false);
        preview.removeEventListener("mousemove", test, false);
        self.downPos = "";
      });
    },
    dragStart: function (e) {
      var self = this;
      var crop = document.getElementById("crop");
      crop.addEventListener("mousemove", self.dragCrop, false);
      self.dragPoint = {
        x: e.layerX,
        y: e.layerY
      }
    },
    dragCrop: function (e) {
      var curTop, curLeft;
      if (this.downPos !== "nw" && this.downPos !== "ne") {
        curTop = this.top - (this.dragPoint.y - e.layerY);
        curLeft = this.left - (this.dragPoint.x - e.layerX);
        if (curTop < 0) {
          this.top = 0;
        } else {
          this.top = curTop;
        }

        if (curLeft < 0) {
          this.left = 0;
        } else {
          this.left = curLeft;
        }

        if (this.top + this.height > this.imageInfo.height) {
          this.top = this.imageInfo.height - this.height;
        }

        if (this.left + this.width > this.imageInfo.width) {
          this.left = this.imageInfo.width - this.width;
        }
        console.log(this.curInfo);
      }
    },
    dragEnd: function() {
      var self = this;
      var crop = document.getElementById("crop");
      crop.removeEventListener("mousemove", self.dragCrop, false);
    }
  }
});