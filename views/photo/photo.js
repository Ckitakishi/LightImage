/**
 * Created by chen on 15/04/10.
 */
window.onload = function() {
  var canvas = document.getElementById("myCanvas");
  var image = document.getElementById("imageSource");

  // re-size the canvas deminsion
  canvas.width  = image.width;
  canvas.height = image.height;

  // get 2D render object
  var ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // gray filter
  for ( var x = 0; x < canvasData.width; x++) {
    for ( var y = 0; y < canvasData.height; y++) {

      // Index of the pixel in the array
      var idx = (x + y * canvasData.width) * 4;
      var r = canvasData.data[idx + 0];
      var g = canvasData.data[idx + 1];
      var b = canvasData.data[idx + 2];

      // calculate gray scale value
      var gray = .299 * r + .587 * g + .114 * b;

      // assign gray scale value
      canvasData.data[idx + 0] = gray; // Red channel
      canvasData.data[idx + 1] = gray; // Green channel
      canvasData.data[idx + 2] = gray; // Blue channel
      canvasData.data[idx + 3] = 255; // Alpha channel

      //// add black border
      //if(x < 8 || y < 8 || x > (canvasData.width - 8) || y > (canvasData.height - 8))
      //{
      //  canvasData.data[idx + 0] = 0;
      //  canvasData.data[idx + 1] = 0;
      //  canvasData.data[idx + 2] = 0;
      //}
    }
  }
  ctx.putImageData(canvasData, 0, 0); // at coords 0,0
};