"use strict";

function Game() {
    this._ui = new UI(this);
    this._board = new Board();
    this._curSide = STONE.EMPTY;
    this._lastIdx = -1;
}

Game.prototype.restart = function () {
    this._board.reset();
    this._curSide = STONE.WHITE;
    this._lastIdx = -1;
    this._ui.update();
};

Game.prototype.loadFen = function (ypn) {
    var ypnArray = ypn.split(" ");
    var ypnStr = ypnArray[0];
    var side = ypnArray[1];
    this.restart();
    if (side == "w") {
        this._curSide = STONE.WHITE;
    } else if (side == "b") {
        this._curSide = STONE.BLACK;
    }
    ypnArray = ypnStr.split("/");
    for (var x = 0; x < HEX_NUM_HALF; x++) {
        var row = ypnArray[x];
        var idx = x < 5 ? 0 : (x - 4);
        for (var y = 0; y < row.length; y++) {
            switch (row[y]) {
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    idx += parseInt(row[y]);
                    break;
                case "w":
                    this._board._stones[XY2IDX(x, idx)] = STONE.WHITE;
                    idx++;
                    break;
                case "b":
                    this._board._stones[XY2IDX(x, idx)] = STONE.BLACK;
                    idx++;
                    break;
            }
        }
    }
    this._ui.update();
};

Game.prototype.getFen = function () {
    var ypn = "";
    for (var x = 0; x < HEX_NUM_HALF; x++) {
        var count = 0;
        for (var y = 0; y < HEX_NUM_HALF; y++) {
            var idx = XY2IDX(x, y) + (x < 5 ? 0 : (x - 4));
            if (this._board._mask[idx] === 3) {
                if (this._board._stones[idx] === STONE.EMPTY) {
                    count++;
                    if(y === 8) {
                        ypn += count.toString();
                    }
                } else if (this._board._stones[idx] === STONE.WHITE) {
                    if (count > 0) {
                        ypn += count.toString();
                    }
                    count = 0;
                    ypn += "w";
                } else if (this._board._stones[idx] === STONE.BLACK) {
                    if (count > 0) {
                        ypn += count.toString();
                    }
                    count = 0;
                    ypn += "b";
                }
            } else {
                if (count > 0) {
                    ypn += count.toString();
                }
                break;
            }
        }
        if (x < 8) {
            ypn += "/";
        } else {
            ypn += " ";
        }
    }
    if (this._curSide == STONE.WHITE) {
        ypn += "w";
    } else if (this._curSide == STONE.BLACK) {
        ypn += "b";
    }
    return ypn;
};

Game.prototype.changSide = function () {
    this._curSide ^= 3;
};

//Game.prototype.swap = function () {
//    // change color
//    this.changSide();
//};

Game.prototype.onCellClick = function (idx) {
    if(this._board._stones[idx] !== STONE.EMPTY) {
        return;
    }
    var m = MOVE(this._curSide, idx);
    this._board.makeMove(m);
    this._lastIdx = idx;
    this.changSide();
    this._ui.update();
};
