(function () {

  if (typeof Tetris === "undefined") {
    window.Tetris = {};
  }

  var tetromino = Tetris.Tetromino = function (obj) {
    this.color = obj.color;
    this.origin = [0, 0];
    this.moveRate = 2;
    this.blockWidth = Tetris.game.DIM_X/10;
    this.blockHeight = Tetris.game.DIM_Y/20

    this.createCells = function () {
      for(var i = 0; i < this.shape.length; i++) {
        for(var j = 0; j < this.shape[0].length; j++){
          if (this.shape[i][j]) {
            this.shape[i][j] = this.shape[i][j]({
              color: this.color,
              origin: [
                        this.origin[0] + i*this.blockWidth,
                        this.origin[1] + j*this.blockHeight
                      ]
            });
          }
        }
      }
    }

    this.move = function (options) {
      if (options && options.vector === undefined) {
        options.vector = [0, this.moveRate]
      }

      this.testMove(options, function () {
        this.setNewOrigin(
          [
            this.origin[0] + options.vector[0],
            this.origin[1] + options.vector[1]
          ]
        );
      }.bind(this));
    }

    this.testMove = function (options, callback) {
      var sideTestTetromino = this.duplicate();
      sideTestTetromino.setNewOrigin(
        [
          this.origin[0] + options.vector[0],
          this.origin[1]
        ]);

      if (!sideTestTetromino.checkSides()) {
        return;
      }

      var bottomTestTetromino = this.duplicate();
      bottomTestTetromino.setNewOrigin(
        [
          this.origin[0],
          this.origin[1] + options.vector[1]
        ]);
      if (bottomTestTetromino.isAtBottom(this.snapToBottom.bind(this, options.vector[1]))) {
        options.callback && options.callback();
        return;
      }
      callback && callback();
    }

    this.snapToBottom = function (vector, cell, bottom) {
      var distance = bottom - (cell.bottom() - vector);
      this.setNewOrigin(
        [
          this.origin[0],
          this.origin[1] + distance
        ]
      );
    }

    this.isAtBottom = function (callback) {
      var cells = this.cells();
      for (var i = 0; i < cells.length; i++) {
        if (cells[i].isCollided(Tetris.game, callback)) {
          return true;
        }
      }
      return false;
    }

    this.checkSides = function () {
      var cells = this.cells();
      for (var i = 0; i < cells.length; i++) {
        if (cells[i].isCollided(Tetris.game)) {
          return false;
        }
      }
      return true;
    }

    this.draw = function (ctx) {
      this.cells().forEach(function (cell) {
        cell.draw(ctx);
      });
    }

    this.clear = function (ctx) {
      this.cells().forEach(function (cell) {
        ctx.clearRect(cell.origin[0], cell.origin[1],
          this.blockWidth, this.blockHeight);
      }.bind(this));
    }

    this.cells = function () {
      var cells = []
      for(var i = 0; i < this.shape.length; i++) {
        for(var j = 0; j < this.shape[0].length; j++){
          if (this.shape[i][j] === null) {
            continue;
          }
          cells.push(this.shape[i][j]);
        }
      }
      return cells;
    }

    this.cell = function(obj){
      return new Tetris.Cell(obj)
    }

    this.moveRight = function (callback) {
      this.move({
        vector: [this.blockWidth, 0],
        callback: callback
      });
    }

    this.moveLeft = function (callback) {
      this.move({
        vector: [-this.blockWidth, 0],
        callback: callback
      });
    }

    this.moveDown = function (callback) {
      this.move({
        vector: [0, this.blockHeight],
        callback: callback
      });
    }

    this.rotate = function () {
      var rotatedShape = new Array(this.shape[0].length);
      rotatedShape = _.map(rotatedShape, function () {
        return new Array(this.shape.length);
      }.bind(this));
      for (var i = 0; i < this.shape.length; i++) {
        for (var j = 0; j < this.shape[0].length; j++) {
          if (this.shape[i][j]) {
              rotatedShape[j][i] = this.shape[i][j].duplicate();
          } else {
            rotatedShape[j][i] = null;
          }
        }
      }
      for (var i = 0; i < rotatedShape.length; i++) {
        rotatedShape[i] = rotatedShape[i].reverse();
      }
      var tetrominoDuplicate = this.duplicate();
      tetrominoDuplicate.shape = rotatedShape;
      tetrominoDuplicate.setNewOrigin(this.origin);
      var cells = tetrominoDuplicate.cells();
      for (var i = 0; i < cells.length; i++) {
        if (cells[i].isCollided(Tetris.game)) {
          return;
        }
      }
      this.shape = rotatedShape;
      this.setNewOrigin(this.origin);
    }

    // add cache with this._bottomCell
    this.bottomCell = function () {
      var cells = this.cells();
      var bottomCell = cells[0];
      for(var i = 0; i < cells.length; i++) {
        if (cells[i].bottom(this.blockHeight) > bottomCell.bottom(this.blockHeight)) {
          bottomCell = cells[i]
        }
      }
      return bottomCell;
    }

    this.distanceToBottom = function () {
      var bottomCell = this.bottomCell();
      return Tetris.game.bottom(bottomCell.origin[0]) - this.bottomCell().bottom(this.blockHeight);
    }

    this.originWithCenter = function (pos) {
      var length = this.shape.length * this.blockHeight;
      var width = this.width() * this.blockWidth;
      return [(pos[0] - length)/2, (pos[1] - width)/2];
    }

    this.width = function () {
      var longestRow = this.shape[0].length;
      for (var i = 1; i < this.shape.length; i++) {
        var currentLength = this.shape[i].length;
        if (currentLength > longestRow) {
          longestRow = currentLength;
        }
      }
      return longestRow;
    }

    this.duplicate = function () {
      var shapeDuplicate = [];
      for (var i = 0; i < this.shape.length; i++) {
        shapeDuplicate.push([]);
        for (var j = 0; j < this.shape[i].length; j++) {
          if (this.shape[i][j]) {
            shapeDuplicate[i][j] = this.shape[i][j].duplicate();
          }
          else {
            shapeDuplicate[i][j] = null;
          }
        }
      }
      var tetrominoDuplicate = new tetromino({
        color: this.color
      });
      tetrominoDuplicate.shape = shapeDuplicate;
      return tetrominoDuplicate;
    }

    this.setNewOrigin = function (pos) {
      this.origin = pos;
      for (var i = 0; i < this.shape.length; i++) {
        for (var j = 0; j < this.shape[0].length; j++) {
          if (this.shape[i][j]) {
            this.shape[i][j].setOrigin(
                    [
                      pos[0] + i*this.blockWidth,
                      pos[1] + j*this.blockHeight
                    ]
            );
          }
        }
      }
    }

    if (obj.shape) {
      this.shape = obj.shape();
      this.createCells();
    }
  }

  var I = Tetris.I = function () {
    tetromino.call(this, {
      shape: function () {
        return [
                [this.cell.bind(this),
                 this.cell.bind(this),
                 this.cell.bind(this),
                 this.cell.bind(this)]
              ];
            }.bind(this),
      color: "#00CED1"
    });
  }

  Tetris.Util.inherits(I, tetromino);

  var O = Tetris.O = function () {
    tetromino.call(this, {
      shape: function () {
        return [
                [this.cell.bind(this), this.cell.bind(this)],
                [this.cell.bind(this), this.cell.bind(this)]
              ];
      }.bind(this),
      color: "#FFD700"
    });
  }

  Tetris.Util.inherits(O, tetromino);

  var T = Tetris.T = function () {
    tetromino.call(this, {
      shape: function () {
        return [
                [null,this.cell.bind(this),null],
                [this.cell.bind(this),this.cell.bind(this),this.cell.bind(this)]
              ];
        }.bind(this),
        color: "#7B68EE"
    });
  }

  Tetris.Util.inherits(T, tetromino);

  var S = Tetris.S = function () {
    tetromino.call(this, {
      shape: function () {
       return [
                [null,this.cell.bind(this),this.cell.bind(this)],
                [this.cell.bind(this),this.cell.bind(this),null]
              ];
      }.bind(this),
      color: "#32CD32"
    });
  }

  Tetris.Util.inherits(S, tetromino);

  var Z = Tetris.Z = function () {
    tetromino.call(this, {
      shape: function () {
        return [
                [this.cell.bind(this),this.cell.bind(this),null],
                [null,this.cell.bind(this),this.cell.bind(this)]
               ];
      }.bind(this),
      color: "#DC143C"
    });
  }

  Tetris.Util.inherits(Z, tetromino);

  var J = Tetris.J = function () {
    tetromino.call(this, {
      shape: function () {
             return [
                [null,this.cell.bind(this)],
                [null,this.cell.bind(this)],
                [this.cell.bind(this),this.cell.bind(this)]
              ];
      }.bind(this),
      color: "#00008B"
    });
  }

  Tetris.Util.inherits(J, tetromino);

  var L = Tetris.L = function () {
    tetromino.call(this, {
      shape: function () {
        return [
                [this.cell.bind(this),null],
                [this.cell.bind(this),null],
                [this.cell.bind(this),this.cell.bind(this)]
               ];
      }.bind(this),
      color: "#FF8C00"
    });
  }

  Tetris.Util.inherits(L, tetromino);

})();
