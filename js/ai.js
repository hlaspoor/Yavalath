"use strict";

function AI(g) {
    this._game = g;
    this._board = g._board;
}

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

AI.prototype.generateMoves = function () {
    var mvs = [];
    var attMvs = [];
    var defMvs = [];
    var s;
    for (var idx = 0; idx < HEX_NUM; idx++) {
        if (this._board._mask[idx] === 3 && this._board._stones[idx] === STONE.EMPTY) {
            mvs.push(MOVE(this._game._curSide, idx));
            s = this.checkDir(idx, DIR.RIGHT);
            if (s !== STONE.EMPTY) {
                if (s === this._game._curSide) {
                    attMvs.push(MOVE(s, idx));
                } else {
                    defMvs.push(MOVE(s, idx));
                }
            }
            s = this.checkDir(idx, DIR.LEFT_DOWN);
            if (s !== STONE.EMPTY) {
                if (s === this._game._curSide) {
                    attMvs.push(MOVE(s, idx));
                } else {
                    defMvs.push(MOVE(s, idx));
                }
            }
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

