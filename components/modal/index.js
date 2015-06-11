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