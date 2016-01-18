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
                    this._board._stones[XY_TO_IDX(x, idx)] = STONE.WHITE;
                    idx++;
                    break;
                case "b":
                    this._board._stones[XY_TO_IDX(x, idx)] = STONE.BLACK;
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
            var idx = XY_TO_IDX(x, y) + (x < 5 ? 0 : (x - 4));
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

// 检测指定位置的指定方向上相邻同色棋子总数是否大于等于3
// 如果相邻的白棋总数量大于3, 返回STONE.WHITE
// 如果相邻的黑棋总数量大于3, 返回STONE.BLACK
// 如果相邻的白棋或黑棋的总数量均没有大于3, 返回STONE.EMPTY
Game.prototype.checkDir = function (idx, dir) {
    var wCount = 0;
    var bCount = 0;
    var side;
    var curIdx;
    curIdx = idx - dir;
    side = -1;
    while (curIdx >= 0 && this._board._edge[curIdx] === 0) {
        if (this._board._stones[curIdx] !== STONE.EMPTY) {
            if (side === -1) {
                if (this._board._stones[curIdx] === STONE.WHITE) {
                    side = STONE.WHITE;
                    wCount++;
                } else {
                    side = STONE.BLACK;
                    bCount++;
                }
            } else if (side === this._board._stones[curIdx]) {
                if (this._board._stones[curIdx] === STONE.WHITE) {
                    wCount++;
                } else {
                    bCount++;
                }
            } else {
                break;
            }
        } else {
            break;
        }
        curIdx -= dir;
    }
    curIdx = idx + dir;
    side = -1;
    while (curIdx < HEX_NUM && this._board._edge[curIdx] === 0) {
        if (this._board._stones[curIdx] !== STONE.EMPTY) {
            if (side === -1) {
                if (this._board._stones[curIdx] === STONE.WHITE) {
                    side = STONE.WHITE;
                    wCount++;
                } else {
                    side = STONE.BLACK;
                    bCount++;
                }
            } else if (side === this._board._stones[curIdx]) {
                if (this._board._stones[curIdx] === STONE.WHITE) {
                    wCount++;
                } else {
                    bCount++;
                }
            } else {
                break;
            }
        } else {
            break;
        }
        curIdx += dir;
    }
    if (wCount >= 3) {
        return STONE.WHITE;
    }
    if (bCount >= 3) {
        return STONE.BLACK;
    }
    return STONE.EMPTY;
};

// 生成当前方的所有走法
// 如果当前方有连4走法, 只生成连4走法
// 如果对方有冲三的棋型, 只生成阻止对方连4的走法
Game.prototype.generateMoves = function () {
    var mvs = [];       // 可以下子的所有走法
    var attMvs = [];    // 当前行棋方连4的走法
    var defMvs = [];    // 阻止对方连4的走法
    var s;
    for (var idx = 0; idx < HEX_NUM; idx++) {
        if (this._board._mask[idx] === 3 && this._board._stones[idx] === STONE.EMPTY) {
            mvs.push(MOVE(this._curSide, idx));
            // 检测从左到右
            s = this.checkDir(idx, DIR.RIGHT);
            if (s !== STONE.EMPTY) {
                if (s === this._curSide) {
                    attMvs.push(MOVE(s, idx));
                } else {
                    defMvs.push(MOVE(s, idx));
                }
            }
            // 检测从右上到左下
            s = this.checkDir(idx, DIR.LEFT_DOWN);
            if (s !== STONE.EMPTY) {
                if (s === this._curSide) {
                    attMvs.push(MOVE(s, idx));
                } else {
                    defMvs.push(MOVE(s, idx));
                }
            }
            // 检测从左上到右下
            s = this.checkDir(idx, DIR.RIGHT_DOWN);
            if (s !== STONE.EMPTY) {
                if (s === this._curSide) {
                    attMvs.push(MOVE(s, idx));
                } else {
                    defMvs.push(MOVE(s, idx));
                }
            }
        }
    }
    if (attMvs.length > 0) {
        return attMvs;
    }
    if (defMvs.length > 0) {
        return defMvs;
    }
    return mvs;
};

//Game.prototype.checkGameOver = function () {
//
//    return STONE.EMPTY;
//};

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
