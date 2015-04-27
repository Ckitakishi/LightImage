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
            self.$dispatch("loaded");
          };
        };

        reader.readAsDataURL(input.files[0]);
      }
    }
  },
  events: {
    imageHide: function () {
      this.imgShow = false;
    }
  }
});