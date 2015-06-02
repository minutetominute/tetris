(function () {

  if (typeof Tetris === "undefined") {
    window.Tetris = {};
  }

  var GameView = Tetris.GameView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.bindKeys();
  }

  GameView.prototype.start = function () {
    window.setInterval((function () {
      Tetris.game.step();
      Tetris.game.draw(this.ctx);
    }).bind(this), 20)
  }

  GameView.prototype.bindKeys = function () {
    var callback = this.game.setNewRandomTetromino.bind(this.game);
    key("right", function () {
      this.game.activeTetromino.moveRight(callback);
    }.bind(this));
    key("left", function () {
      this.game.activeTetromino.moveLeft(callback);
    }.bind(this));
    key("down", function () {
      this.game.activeTetromino.moveDown(callback);
    }.bind(this));
    key("up", function () {
      this.game.activeTetromino.rotate();
    }.bind(this));
  }
})();
