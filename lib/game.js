(function () {

  if (typeof Tetris === "undefined") {
    window.Tetris = {};
  }

  var Game = Tetris.Game = function () {
    Tetris.game = this;
    this.DIM_X = 400;
    this.DIM_Y = 800;
    this.activeTetromino = new Tetris.I();
    this.inactiveCells = [];
    this.tetrominos = [Tetris.I,
                       Tetris.O,
                       Tetris.T,
                       Tetris.S,
                       Tetris.Z,
                       Tetris.J,
                       Tetris.L];
  };

  Game.prototype.step = function () {
    this.moveTetromino();
    this.checkRows();
  }

  Game.prototype.moveTetromino = function () {
    this.activeTetromino.move({ callback: this.setNewRandomTetromino.bind(this) });
  }

  Game.prototype.randomTetromino = function () {
    return new this.tetrominos[Math.floor(Math.random() * this.tetrominos.length)];
  }

  Game.prototype.setNewRandomTetromino = function () {
    this.activeTetromino.cells().forEach(function (cell) {
      var row = (this.DIM_Y - cell.origin[1])/(this.DIM_Y/20) - 1;
      var column = cell.origin[0]/(this.DIM_X/10);
      if (typeof this.inactiveCells[row] === "undefined") {
        this.inactiveCells[row] = [];
      }
      if (typeof this.inactiveCells[row][column] === "undefined") {
        this.inactiveCells[row][column] = [];
      }
      this.inactiveCells[row][column] = cell;
    }.bind(this));
    this.activeTetromino = this.randomTetromino();
  }

  Game.prototype.cellsAtRow = function (y_coord) {
    var row = (this.DIM_Y - y_coord)/(this.DIM_Y/20) - 1;
    return this.inactiveCells[row];
  }

  Game.prototype.cellsAtColumn = function (x_coord) {
    var column = x_coord/(this.DIM_X/10);
    var cells = [];
    for(var i = 0; i < this.inactiveCells.length; i++) {
      var cell = this.inactiveCells[i][column];
      if (cell) {
        cells.push(this.inactiveCells[i][column]);
      }
    }
    return cells;
  }

  Game.prototype.bottom = function (x_coord) {
    var cells = this.cellsAtColumn(x_coord);
    if (cells.length === 0) {
      return this.DIM_Y;
    }
    return _.last(cells).origin[1];
  }

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0,0, this.DIM_X, this.DIM_Y);
    this.activeTetromino.draw(ctx);

    _.flatten(this.inactiveCells).forEach(function (cell) {
      if (cell) {
        cell.draw(ctx);
      }
    });
  }

  Game.prototype.checkRows = function () {

    // this.inactiveCells.forEach(function (row) {
    //   if (this.isRowComplete(row)) {
    //   }
    // });
  }

  Game.prototype.clearRow = function (rowIdx) {

  };

  Game.prototype.isRowComplete = function (row) {
    var result = true;
    row.forEach(function(cell) {
      if (!cell) {
        result = false;
      }
    })
    if (row.length !== 10) {
      result = false;
    }
    return result;
  };

})();
