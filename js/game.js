"use strict";

function Game() {
    this._ui = new UI(this);
    this._board = new Board();
    this._curSide = EMPTY;
    this._lastIdx = -1;
}

Game.prototype.restart = function () {
    this._board.reset();
    this._curSide = WHITE;
    this._lastIdx = -1;
};

Game.prototype.loadYpn = function (ypn) {
    var ypnArray = ypn.split(" ");
    var ypnStr = ypnArray[0];
    var side = ypnArray[1];
    this.restart();
    if (side == "w") {
        this._curSide = WHITE;
    } else if (side == "b") {
        this._curSide = BLACK;
    }
    ypnArray = ypnStr.split("/");
    for (var x = 0; x < 9; x++) {
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
                    this._board._stones[XY2IDX(x, idx)] = WHITE;
                    idx++;
                    break;
                case "b":
                    this._board._stones[XY2IDX(x, idx)] = BLACK;
                    idx++;
                    break;
            }
        }
    }
    this._ui.update();
};

Game.prototype.getYpn = function () {
    var ypn = "";
    for (var x = 0; x < 9; x++) {
        var count = 0;
        for (var y = 0; y < 9; y++) {
            var idx = XY2IDX(x, y) + (x < 5 ? 0 : (x - 4));
            if (this._board._mask[idx] === 3) {
                if (this._board._stones[idx] === EMPTY) {
                    count++;
                    if(y === 8) {
                        ypn += count.toString();
                    }
                } else if (this._board._stones[idx] === WHITE) {
                    if (count > 0) {
                        ypn += count.toString();
                    }
                    count = 0;
                    ypn += "w";
                } else if (this._board._stones[idx] === BLACK) {
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
    if (this._curSide == WHITE) {
        ypn += "w";
    } else if (this._curSide == BLACK) {
        ypn += "b";
    }
    return ypn;
};

Game.prototype.changSide = function () {
    this._curSide ^= 3;
};

Game.prototype.onCellClick = function (idx) {
    var m = MOVE(this._curSide, idx);
    this._board.makeMove(m);
    this._lastIdx = idx;
    this.changSide();
    console.log(this.getYpn());
    this._ui.update();
};
