(function () {

  if (typeof Tetris === "undefined") {
    window.Tetris = {};
  }

  var Cell = Tetris.Cell = function (obj) {
    this.origin = obj.origin;
    this.color = obj.color;
    this.cellWidth = Tetris.game.DIM_X/10;
    this.cellHeight = Tetris.game.DIM_Y/20;

    this.setOrigin = function (origin) {
      this.origin[0] = origin[0];
      this.origin[1] = origin[1];
    }

    this.draw = function (ctx) {
      ctx.fillStyle = this.color;
      ctx.strokeStyle= "white";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.rect(this.origin[0], this.origin[1], this.cellWidth, this.cellHeight);
      ctx.fill();
      ctx.stroke();
    }

    this.bottom = function (height) {
      return this.origin[1] + height;
    }

    this.drop = function (ctx) {
      this.origin[1] += this.cellHeight;
    }
  }

})();
