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

    this.bottom = function () {
      return this.origin[1] + this.cellHeight;
    }

    this.drop = function (ctx) {
      this.origin[1] += this.cellHeight;
    }

    this.duplicate = function () {
      return new Cell({
        origin: [this.origin[0], this.origin[1]],
        color: this.color
      });
    }

    this.isWithinCell = function (cell) {
      var thisLeft = this.origin[0];
      var thisRight = this.origin[0] + this.cellWidth;
      var thisTop = this.origin[1];
      var thisBottom = this.bottom();

      var otherLeft = cell.origin[0];
      var otherRight = cell.origin[0] + cell.cellWidth;
      var otherTop = cell.origin[1];
      var otherBottom = cell.bottom();

      if (thisBottom <= otherTop) {
        return false;
      }
      if (thisTop >= otherBottom) {
        return false;
      }
      if (thisLeft >= otherRight) {
        return false;
      }
      if (thisRight <= otherLeft) {
        return false;
      }
      return true;
    }

    this.isCollided = function (game, callback) {
      //check if origin is inside any other cells
      var inactiveCells = _.flatten(game.inactiveCells);
      for (var i = 0; i < inactiveCells.length; i++) {
        var cellToCheck = inactiveCells[i];
        if (cellToCheck && this.isWithinCell(cellToCheck)) {
          callback && callback(this, cellToCheck.origin[1]);
          return true;
        }
      }

      //check if origin is outside game boundary
      if (this.origin[0] < 0
        || ((this.origin[0] + this.cellWidth) > game.DIM_X)) {
        return true;
      } else if ((this.origin[1] + this.cellHeight) > game.DIM_Y) {
        callback && callback(this, game.DIM_Y);
        return true;
      }
      return false;
    }

  }

})();
