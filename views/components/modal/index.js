Vue.component('modal-component', {
  template: '#temp-modal',
  data: function () {
    return {
      save: false,
      sizing: false,
      imageName: "",
      imageType: "png",
      width: 0,
      height: 0
    }
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
        var canvas = document.getElementById("myCanvas");
        var aLink = document.createElement("a"),
            event = document.createEvent("event");

        var url;
        if (this.imageType === "PNG") {
          url = canvas.toDataURL();
        } else {
          url = canvas.toDataURL("image/" + this.imageType);
        }
        event.initEvent("click");
        aLink.download = this.imageName;
        aLink.href = url;
        aLink.dispatchEvent(event);
      } else {
        var result = "test";
        this.$dispatch("startAction", result);
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
        self.sizing = true;
      }
    },
    imageInfo: function (imageInfo) {

    }
  }
});