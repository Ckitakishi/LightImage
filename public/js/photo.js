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
      var data = canvasData.data;
      var r, g, b, a;

      for (var i = 0, len = data.length; i < len; i+=4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];
        a = data[i + 3];

        var gray = .299 * r + .587 * g + .114 * b;

        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }
      ctx.putImageData(canvasData, 0, 0); // at coords 0,0
    }
  }
});