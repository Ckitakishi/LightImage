Vue.component('upload-component', {
  template: '#temp-upload',
  data: function () {
    return {
      heigth: 0,
      width: 0
    }
  },
  created: function() {

  },
  methods: {
    init: function () {
      this.width = 0;
      this.height = 0;
    },
    uploadFile: function () {
      var self = this;

      function readURL(input) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          var image = new Image();

          reader.onload = function (e) {
            $('#image-source').attr('src', e.target.result);
            // 务必为image的src属性赋值；
            image.src = e.target.result;
            image.onload = function () {
              self.width = 400;
              self.height = this.height * (this.width/self.width);
            };
          };

          reader.readAsDataURL(input.files[0]);
        }
      }

      $("#upload-file").change(function(){
        readURL(this);
      });
    }
  }
});