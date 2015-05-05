Vue.component('modal-component', {
  template: '#temp-modal',
  data: function () {
    return {
      sizing: false,
      width: 0,
      height: 0
    }
  },
  methods: {
    clickCancel: function () {
      this.$dispatch("closeModal");
    },
    clickOK: function () {
      var result = "test";
      this.$dispatch("startAction", result);
    }
  },
  events: {
    openModal: function (result) {
      if (result.type && result.type === "sizing") {
        this.width = result.width;
        this.height = result.height;
        this.sizing = true;
      }
    },
    imageInfo: function (imageInfo) {

    }
  }
});