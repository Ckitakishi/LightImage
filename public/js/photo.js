new Vue({
  el: '#photo-render',
  data: {

  },
  created: function() {
    console.log("create");
  },
  methods: {
    render: function() {
      var canvas = document.getElementById("myCanvas");
      var image = document.getElementById("image-source");

      canvas.width  = image.width;
      canvas.height = image.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      for ( var x = 0; x < canvasData.width; x++) {
        for ( var y = 0; y < canvasData.height; y++) {

          var idx = (x + y * canvasData.width) * 4;
          var r = canvasData.data[idx + 0];
          var g = canvasData.data[idx + 1];
          var b = canvasData.data[idx + 2];

          var gray = .299 * r + .587 * g + .114 * b;

          canvasData.data[idx + 0] = gray; // Red channel
          canvasData.data[idx + 1] = gray; // Green channel
          canvasData.data[idx + 2] = gray; // Blue channel
          canvasData.data[idx + 3] = 255; // Alpha channel

        }
      }
      ctx.putImageData(canvasData, 0, 0); // at coords 0,0
    }
  }
});