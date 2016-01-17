"use strict";

function AI(g) {
    this._game = g;
    this._board = g._board;
}

// 检测指定位置的指定方向上相邻同色棋子总数是否大于等于3
// 如果相邻的白棋总数量大于3, 返回STONE.WHITE
// 如果相邻的黑棋总数量大于3, 返回STONE.BLACK
// 如果相邻的白棋或黑棋的总数量均没有大于3, 返回STONE.EMPTY
AI.prototype.checkDir = function (idx, dir) {
    var wCount = 0;
    var bCount = 0;
    var side;
    var i;
    i = idx - dir;
    side = -1;
    while (i >= 0 && this._board._edge[i] === 0) {
        if (this._board._stones[i] !== STONE.EMPTY) {
            if (side === -1) {
                if (this._board._stones[i] === STONE.WHITE) {
                    side = STONE.WHITE;
                    wCount++;
                } else {
                    side = STONE.BLACK;
                    bCount++;
                }
            } else if (side === this._board._stones[i]) {
                if (this._board._stones[i] === STONE.WHITE) {
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
        i -= dir;
    }
    i = idx + dir;
    side = -1;
    while (i < HEX_NUM && this._board._edge[i] === 0) {
        if (this._board._stones[i] !== STONE.EMPTY) {
            if (side === -1) {
                if (this._board._stones[i] === STONE.WHITE) {
                    side = STONE.WHITE;
                    wCount++;
                } else {
                    side = STONE.BLACK;
                    bCount++;
                }
            } else if (side === this._board._stones[i]) {
                if (this._board._stones[i] === STONE.WHITE) {
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
        i += dir;
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
// 如果已经形成了连4, 不生成任何走法
AI.prototype.generateMoves = function () {
    var mvs = [];       // 可以下子的所有走法
    var attMvs = [];    // 当前行棋方连4的走法
    var defMvs = [];    // 阻止对方连4的走法
    var s;
    for (var idx = 0; idx < HEX_NUM; idx++) {
        if (this._board._mask[idx] === 3 && this._board._stones[idx] === STONE.EMPTY) {
            mvs.push(MOVE(this._game._curSide, idx));
            // 检测从左到右
            s = this.checkDir(idx, DIR.RIGHT);
            if (s !== STONE.EMPTY) {
                if (s === this._game._curSide) {
                    attMvs.push(MOVE(s, idx));
                } else {
                    defMvs.push(MOVE(s, idx));
                }
            }
            // 检测从右上到左下
            s = this.checkDir(idx, DIR.LEFT_DOWN);
            if (s !== STONE.EMPTY) {
                if (s === this._game._curSide) {
                    attMvs.push(MOVE(s, idx));
                } else {
                    defMvs.push(MOVE(s, idx));
                }
            }
            // 检测从左上到右下
            s = this.checkDir(idx, DIR.RIGHT_DOWN);
            if (s !== STONE.EMPTY) {
                if (s === this._game._curSide) {
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

