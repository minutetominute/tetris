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
      this.cells().forEach(function (cell) {
        var cellBottom = cell.bottom(this.blockHeight);
        if (cellBottom + options.vector[1] >= Tetris.game.bottom(cell.origin[0])) {
          var distanceToBottom = this.distanceToBottom();
          options.vector[1] = distanceToBottom;
        }
      }.bind(this));
      this.origin[0] += options.vector[0];
      this.origin[1] += options.vector[1];
      for (var i = 0; i < this.shape.length; i++) {
        for (var j = 0; j < this.shape[0].length; j++) {
          if (this.shape[i][j]) {
            this.shape[i][j].setOrigin(
                    [
                      this.origin[0] + i*this.blockWidth,
                      this.origin[1] + j*this.blockHeight
                    ]
            );
          }
        }
      }
      if (this.distanceToBottom() === 0) {
        options.callback && options.callback();
      }
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
          rotatedShape[j][i] = this.shape[i][j]
        }
      }
      for (var i = 0; i < rotatedShape.length; i++) {
        rotatedShape[i] = rotatedShape[i].reverse();
      }
      this.shape = rotatedShape;
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

    this.shape = obj.shape();
    this.createCells();
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
                [null,this.cell.bind(this),null],
                [null,this.cell.bind(this),null],
                [this.cell.bind(this),this.cell.bind(this),null]
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
                [null,this.cell.bind(this),null],
                [null,this.cell.bind(this),null],
                [null,this.cell.bind(this),this.cell.bind(this)]
               ];
      }.bind(this),
      color: "#FF8C00"
    });
  }

  Tetris.Util.inherits(L, tetromino);

})();
