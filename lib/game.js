(function () {

  if (typeof Tetris === "undefined") {
    window.Tetris = {};
  }

  var Game = Tetris.Game = function () {
    Tetris.game = this;
    this.DIM_X = 400;
    this.DIM_Y = 800;
    this.inactiveCells = this.initializeInactiveCells();
    this.tetrominos = [Tetris.I,
                       Tetris.O,
                       Tetris.T,
                       Tetris.S,
                       Tetris.Z,
                       Tetris.J,
                       Tetris.L
                      ];
    this.activeTetromino = this.randomTetromino();
    this.nextTetromino = this.randomTetromino();
    this.rowsCleared = 0;
  };

  Game.prototype.initializeInactiveCells = function () {
    var array = [];
    for (var i = 0; i < 20; i++) {
      array.push(Array.apply(null, Array(10)))
    }
    return array;
  }

  Game.prototype.step = function (ctx) {
    this.moveTetromino(ctx);
    this.checkRows(ctx);
  }

  Game.prototype.moveTetromino = function (ctx) {
    this.activeTetromino.move({ callback: this.setNewRandomTetromino.bind(this, ctx) });
  }

  Game.prototype.randomTetromino = function () {
    return new this.tetrominos[Math.floor(Math.random() * this.tetrominos.length)];
  }

  Game.prototype.setNewRandomTetromino = function (ctx) {
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
    this.activeTetromino.draw(ctx);
    this.activeTetromino = this.nextTetromino;
    this.nextTetromino = this.randomTetromino();
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
    this.activeTetromino.draw(ctx);
  }

  Game.prototype.clearActiveTetromino = function (ctx) {
    this.activeTetromino.clear(ctx);
  }

  Game.prototype.checkRows = function (ctx) {
    this.inactiveCells.forEach(function (row, idx) {
      if (this.isRowComplete(row)) {
        this.clearRow(idx, ctx);
      }
    }.bind(this));
  }

  Game.prototype.clearRow = function (rowIdx, ctx) {
    this.inactiveCells.splice(rowIdx, 1);
    ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
    for (var i = rowIdx; i < this.inactiveCells.length; i++) {
      for (var j = 0; j < this.inactiveCells[i].length; j++) {
        if (this.inactiveCells[i][j]) {
          this.inactiveCells[i][j].drop(ctx);
        }
      }
    }
    for (var i = 0; i < this.inactiveCells.length; i++) {
      for (var j = 0; j < this.inactiveCells[i].length; j++) {
        if (this.inactiveCells[i][j]) {
          this.inactiveCells[i][j].draw(ctx);
        }
      }
    }

    this.inactiveCells.push(Array.apply(null, Array(10)))
    this.rowsCleared += 1;
  };

  Game.prototype.isRowComplete = function (row) {
    var result = true;
    for (var i = 0; i < row.length; i++) {
      if (!row[i]) {
        result = false;
      }
    }
    return result;
  };

  Game.prototype.isOver = function () {
    for (var i = 0; i < _.last(this.inactiveCells).length; i++) {
      if (_.last(this.inactiveCells)[i]) {
        return true;
      }
    }
    return false;
  }

})();
