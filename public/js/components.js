/*! LightImage - v0.0.1 - 2015-06-17 */
Vue.component('back-component', {
  template: '#temp-back',
  data: function () {
    return {

    }
  },
  methods: {
    backToHome: function () {
      // animation broadcast
    }
  }
});
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
      var nwZoom = function (e) {
        self.resizeZoom(e);
      };
      self.$el.addEventListener("mousemove", nwResize, false);
      preview.addEventListener("mousemove", nwZoom, false);
      //self.$el.addEventListener("mouseup", function () {
      //  self.$el.removeEventListener("mousemove", test, false);
      //});
      // TODO: 暂时先设为windows
      window.addEventListener("mouseup", function () {
        self.$el.removeEventListener("mousemove", nwResize, false);
        preview.removeEventListener("mousemove", nwZoom, false);
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
    },
    crop: function() {
      var crop = document.getElementById("crop");
      var cropWidth = crop.offsetWidth;
      var cropHeight = crop.offsetHeight;

      var cropInfo = {
        left: this.left,
        top: this.top,
        width: cropWidth,
        height: cropHeight
      };
      this.$dispatch("startCrop", cropInfo);
    }
  }
});
Vue.component('modal-component', {
  template: '#temp-modal',
  data: function () {
    return {
      save: false,
      sizing: false,
      imageName: "",
      imageType: "png",
      width: 0,
      height: 0,
      whRatio: 1
    }
  },
  created: function () {
    this.$watch('width', function () {
      this.height = Math.floor(this.width / this.whRatio);
    });

    this.$watch('height', function () {
      this.width = Math.floor(this.height * this.whRatio);
    });
  },
  methods: {
    reload: function () {
      this.save = false;
      this.sizing = false;
    },
    clickCancel: function () {
      this.$dispatch("closeModal");
    },
    clickOK: function () {
      if (this.save) {
        var image = document.getElementById("image-source");

        if (image.style.display === "none") {
          var canvas = document.getElementById("myCanvas"),
            aLink = document.createElement("a"),
            event = document.createEvent("event");

          var url;
          if (this.imageType === "png") {
            url = canvas.toDataURL();
          } else {
            url = canvas.toDataURL("image/" + this.imageType);
          }
          event.initEvent("click");
          aLink.download = this.imageName;
          aLink.href = url;
          aLink.dispatchEvent(event);
          // 最好等待图片保存结束
          //this.$dispatch("closeModal");
        } else {
          console.log("还未修改，做出提示");
        }
      } else if (this.sizing) {
        var result = {
          type: "sizing",
          width: this.width,
          height: this.height
        };
        this.$dispatch("startAction", result);
      } else {

      }
    }
  },
  events: {
    openModal: function (result) {
      if (!result.type) {
        return;
      }
      var self = this;
      self.reload();

      if (result.type === "save") {
        self.save = true;
      } else if (result.type === "sizing") {
        self.width = result.width;
        self.height = result.height;
        self.whRatio = result.width / result.height;
        self.sizing = true;
      }
    }
  }
});
Vue.component('upload-component', {
  template: '#temp-upload',
  data: function () {
    return {
      heigth: 0,
      width: 0,
      imgShow: false,
      src: ""
    }
  },
  methods: {
    init: function () {
      this.width = 0;
      this.height = 0;
    },
    uploadFile: function () {
      var input = document.getElementById("upload-file");
      var self = this;
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        var image = new Image();

        reader.onload = function (e) {
          self.src = e.target.result;
          // 务必为image的src属性赋值；
          image.src = e.target.result;
          image.onload = function () {
            self.width = 100;
            self.imgShow = true;
            var imageInfo = {
              width: image.width,
              height: image.height
            };
            self.$dispatch("loaded", imageInfo);
          };
        };

        reader.readAsDataURL(input.files[0]);
      }
    }
  },
  events: {
    imageHide: function () {
      this.imgShow = false;
    },
    modifySource: function (source) {
      this.src = source;
    }
  }
});