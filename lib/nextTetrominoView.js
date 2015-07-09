(function () {

  if (typeof Tetris === "undefined") {
    window.Tetris = {};
  }

  var NextTetrominoView = Tetris.NextTetrominoView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.DIM_X = 150;
    this.DIM_Y = 150;
    requestAnimationFrame(this.draw.bind(this));
  }

  NextTetrominoView.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
    var temp = this.game.nextTetromino.duplicate();
    temp.setNewOrigin(temp.originWithCenter([this.DIM_X, this.DIM_Y]));
    temp.draw(this.ctx);
    requestAnimationFrame(this.draw.bind(this));
  }

})();
