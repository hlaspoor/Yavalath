"use strict";

function MoveGen(ai) {
    this._board = ai;
}

// 检测指定位置的指定方向上相邻同色棋子总数是否大于等于3
// 如果相邻的白棋总数量大于3并且没有连3, 返回STONE.WHITE
// 如果相邻的黑棋总数量大于3并且没有连3, 返回STONE.BLACK
// 如果相邻的白棋或黑棋的总数量均没有大于3, 返回STONE.EMPTY
MoveGen.prototype.check_dir = function (idx, dir) {
    var wCountL = 0;
    var wCountR = 0;
    var wCount = 0;
    var bCountL = 0;
    var bCountR = 0;
    var bCount = 0;
    var side;
    var curIdx;
    curIdx = idx - dir;
    side = -1;
    while (curIdx >= 0) {
        if (this._board._stones[curIdx] !== STONE.EMPTY) {
            if (side === -1) {
                if (this._board._stones[curIdx] === STONE.WHITE) {
                    side = STONE.WHITE;
                    wCountL++;
                    wCount++;
                } else {
                    side = STONE.BLACK;
                    bCountL++;
                    bCount++;
                }
            } else if (side === this._board._stones[curIdx]) {
                if (this._board._stones[curIdx] === STONE.WHITE) {
                    wCountL++;
                    wCount++;
                } else {
                    bCountL++;
                    bCount++;
                }
            } else {
                break;
            }
        } else {
            break;
        }
        if(this._board._mask[curIdx] === 0) {
            break;
        }
        curIdx -= dir;
    }
    curIdx = idx + dir;
    side = -1;
    while (curIdx < HEX_NUM) {
        if (this._board._stones[curIdx] !== STONE.EMPTY) {
            if (side === -1) {
                if (this._board._stones[curIdx] === STONE.WHITE) {
                    side = STONE.WHITE;
                    wCountR++;
                    wCount++;
                } else {
                    side = STONE.BLACK;
                    bCountR++;
                    bCount++;
                }
            } else if (side === this._board._stones[curIdx]) {
                if (this._board._stones[curIdx] === STONE.WHITE) {
                    wCountR++;
                    wCount++;
                } else {
                    bCountR++;
                    bCount++;
                }
            } else {
                break;
            }
        } else {
            break;
        }
        if(this._board._mask[curIdx] === 0) {
            break;
        }
        curIdx += dir;
    }
    if (wCount >= 3 && wCountL < 3 && wCountR < 3) {
        return STONE.WHITE;
    }
    if (bCount >= 3 && bCountL < 3 && bCountR < 3) {
        return STONE.BLACK;
    }
    return STONE.EMPTY;
};

// 生成当前方的所有走法
// 如果当前方有连4走法, 只生成连4走法
// 如果对方有冲3并且没有形成连3的棋型, 只生成阻止对方连4的走法
MoveGen.prototype.generate_moves = function () {
    var mvs = [];       // 可以下子的所有走法
    var attMvs = [];    // 当前行棋方连4的走法
    var defMvs = [];    // 阻止对方连4的走法
    var s;
    for (var idx = 0; idx < HEX_NUM; idx++) {
        if (this._board._mask[idx] === 3 && this._board._stones[idx] === STONE.EMPTY) {
            mvs.push(MOVE(this._board._curSide, idx));
            // 检测从左到右
            s = this.check_dir(idx, DIR.RIGHT);
            if (s !== STONE.EMPTY) {
                if (s === this._board._curSide) {
                    attMvs.push(MOVE(s, idx));
                } else {
                    defMvs.push(MOVE(s, idx));
                }
            }
            // 检测从右上到左下
            s = this.check_dir(idx, DIR.LEFT_DOWN);
            if (s !== STONE.EMPTY) {
                if (s === this._board._curSide) {
                    attMvs.push(MOVE(s, idx));
                } else {
                    defMvs.push(MOVE(s, idx));
                }
            }
            // 检测从左上到右下
            s = this.check_dir(idx, DIR.RIGHT_DOWN);
            if (s !== STONE.EMPTY) {
                if (s === this._board._curSide) {
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