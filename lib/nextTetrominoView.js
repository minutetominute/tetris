(function () {

  if (typeof Tetris === "undefined") {
    window.Tetris = {};
  }

  var NextTetrominoView = Tetris.NextTetrominoView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.DIM_X = 200;
    this.DIM_Y = 200;
    requestAnimationFrame(this.draw.bind(this));
  }

  NextTetrominoView.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
    this.game.nextTetromino.draw(this.ctx);
    requestAnimationFrame(this.draw.bind(this));
  }

})();
