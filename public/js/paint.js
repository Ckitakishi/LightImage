new Vue({
  el: '#paint',
  data: {
    isLoad: false,
    canvasShow: false,
    curPoint: {},
    ctx: ""
  },
  methods: {
    paint: function () {
      this.isLoad = true;
      this.canvasShow = true;

      var canvas = document.getElementById("myCanvas");
      var ctx = canvas.getContext("2d");
      this.ctx = ctx;
    },
    drawPath: function(e) {
      var self = this;
      self.ctx.fillStyle = 'red';
      px = e.layerX;
      py = e.layerY;

      function isEmpty(obj)
      {
        for(var x in obj)
        {
          if(obj.hasOwnProperty(x))
          {
            return false;
          }
        }
        return true;
      }

      if (isEmpty(self.curPoint)) {
        self.curPoint.x = px;
        self.curPoint.y = py;
        self.ctx.beginPath();
      } else {
        self.ctx.moveTo(self.curPoint.x, self.curPoint.y);
        self.ctx.lineTo(px, py);
        self.ctx.stroke();
        self.curPoint.x = px;
        self.curPoint.y = py;
      }
    }
  }
});