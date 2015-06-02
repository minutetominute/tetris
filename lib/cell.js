(function () {

  if (typeof Tetris === "undefined") {
    window.Tetris = {};
  }

  var cell = Tetris.Cell = function (obj) {
    this.origin = obj.origin;
    this.color = obj.color;

    this.setOrigin = function (origin) {
      this.origin[0] = origin[0];
      this.origin[1] = origin[1];
    }

    this.draw = function (ctx) {
      ctx.fillStyle = this.color;
      ctx.strokeStyle= "white";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.rect(this.origin[0], this.origin[1], Tetris.game.DIM_X/10, Tetris.game.DIM_Y/20);
      ctx.fill();
      ctx.stroke();
    }

    this.bottom = function (height) {
      return this.origin[1] + height;
    }
  }

})();
