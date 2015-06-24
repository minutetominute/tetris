(function () {

  if (typeof Tetris === "undefined") {
    window.Tetris = {};
  }

  var GameView = Tetris.GameView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.pause = false;
    this.pauseTimer = 0;
    key("p", function () {
      this.pauseGame();
    }.bind(this));
    this.bindKeys();
  }

  GameView.prototype.start = function () {
    requestAnimationFrame(this.draw.bind(this));
  }

  GameView.prototype.draw = function () {

    if (!this.pause && !this.game.isOver()) {
      Tetris.game.clearActiveTetromino(this.ctx);
      Tetris.game.step(this.ctx);
      Tetris.game.draw(this.ctx);
    } else if (this.game.isOver()) {
      this.ctx.clearRect(
        Tetris.game.DIM_X/2 - 75,
        Tetris.game.DIM_Y/2 - 10,
        150,
        20
      );
      this.ctx.font = "20px Helvetica";
      this.ctx.fillStyle = "black"
      this.ctx.textBaseline = "middle";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Game Over!",
                        Tetris.game.DIM_X/2,
                        Tetris.game.DIM_Y/2);
    } else {
      if ((this.pauseTimer % 40) < 20) {
        this.ctx.font = "20px Helvetica";
        this.ctx.fillStyle = "black"
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Game Paused!",
                          Tetris.game.DIM_X/2,
                          Tetris.game.DIM_Y/2);
      }
      else {
        this.ctx.clearRect(
          Tetris.game.DIM_X/2 - 75,
          Tetris.game.DIM_Y/2 - 10,
          150,
          20
        );
      }
      this.pauseTimer += 1;
    }
    requestAnimationFrame(this.draw.bind(this));
  }

  GameView.prototype.pauseGame = function() {
    this.pause = !this.pause;
    if (this.pause) {
      this.ctx.clearRect(
        Tetris.game.DIM_X/2 - 75,
        Tetris.game.DIM_Y/2 - 10,
        150,
        20
      );
      this.unbindKeys();
      this.pauseTimer = 0;
    } else {
      this.ctx.clearRect(
        Tetris.game.DIM_X/2 - 75,
        Tetris.game.DIM_Y/2 - 10,
        150,
        20
      );
      this.bindKeys();
    }
  }

  GameView.prototype.bindKeys = function () {
    var callback = this.game.setNewRandomTetromino.bind(this.game, this.ctx);
    key("right", function () {
      Tetris.game.clearActiveTetromino(this.ctx);
      this.game.activeTetromino.moveRight(callback);
    }.bind(this));
    key("left", function () {
      Tetris.game.clearActiveTetromino(this.ctx);
      this.game.activeTetromino.moveLeft(callback);
    }.bind(this));
    key("down", function () {
      Tetris.game.clearActiveTetromino(this.ctx);
      this.game.activeTetromino.moveDown(callback);
    }.bind(this));
    key("up", function () {
      Tetris.game.clearActiveTetromino(this.ctx);
      this.game.activeTetromino.rotate();
    }.bind(this));
    key("space", function () {
      var tetromino = this.game.activeTetromino;
      Tetris.game.clearActiveTetromino(this.ctx);
      while (tetromino === this.game.activeTetromino) {
        Tetris.game.step(this.ctx);
      }
    }.bind(this));
  }

  GameView.prototype.unbindKeys = function () {
    key.unbind("right");
    key.unbind("left");
    key.unbind("down");
    key.unbind("up");
    key.unbind("space");
  };

})();
