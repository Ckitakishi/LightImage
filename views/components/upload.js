Vue.component('upload-component', {
  template: '#temp-upload',
  data: function () {
    return {

    }
  },
  created: function() {

  },
  methods: {
    uploadFile: function () {
      function readURL(input) {

        if (input.files && input.files[0]) {
          var reader = new FileReader();

          reader.onload = function (e) {
            $('#image-source').attr('src', e.target.result);
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