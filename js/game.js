"use strict";

function Game() {
    this._ui = new UI(this);
    this._board = new Board();
    this._curSide = STONE.EMPTY;
    this._startFen = "";
    this._lastIdx = -1;
    this._allowSwap = true;
    this._moveHistory = [];
    this._moveOrder = 0;
    this._playOrder = 0;
    this._isGameOver = RESULT.NONE;
    this._ai = new Ai();
}

Game.prototype.reset = function () {
    this._board.reset();
    this._curSide = STONE.WHITE;
    this._startFen = this.get_fen();
    this._lastIdx = -1;
    this._moveHistory = [];
    this._moveOrder = 0;
    this._playOrder = 0;
    this._isGameOver = RESULT.NONE;
};

Game.prototype.new_game = function () {
    this.reset();
    this._ui.update();
};

Game.prototype.load_fen = function (fen) {
    var fenArray = fen.trim().split(" ");
    var fenStr = fenArray[0];
    var side = fenArray[1];
    this.reset();
    if (side == "w") {
        this._curSide = STONE.WHITE;
    } else if (side == "b") {
        this._curSide = STONE.BLACK;
    }
    fenArray = fenStr.split("/");
    for (var x = 0; x < HEX_NUM_HALF; x++) {
        var row = fenArray[x];
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
    this._startFen = fen;
};

Game.prototype.get_fen = function () {
    var fen = "";
    for (var x = 0; x < HEX_NUM_HALF; x++) {
        var count = 0;
        for (var y = 0; y < HEX_NUM_HALF; y++) {
            var idx = XY_TO_IDX(x, y) + (x < 5 ? 0 : (x - 4));
            if (this._board._mask[idx] === 3) {
                if (this._board._stones[idx] === STONE.EMPTY) {
                    count++;
                    if (y === 8) {
                        fen += count.toString();
                    }
                } else if (this._board._stones[idx] === STONE.WHITE) {
                    if (count > 0) {
                        fen += count.toString();
                    }
                    count = 0;
                    fen += "w";
                } else if (this._board._stones[idx] === STONE.BLACK) {
                    if (count > 0) {
                        fen += count.toString();
                    }
                    count = 0;
                    fen += "b";
                }
            } else {
                if (count > 0) {
                    fen += count.toString();
                }
                break;
            }
        }
        if (x < 8) {
            fen += "/";
        } else {
            fen += " ";
        }
    }
    if (this._curSide == STONE.WHITE) {
        fen += "w";
    } else if (this._curSide == STONE.BLACK) {
        fen += "b";
    }
    return fen;
};

Game.prototype.get_move_history = function () {
    var mh = "[" + this._startFen + "]\r\n";
    for (var i = 0; i < this._moveHistory.length; i++) {
        if (i % 2 === 0) {
            mh += (i / 2 + 1) + ". ";
        }
        mh += MOVE_NAME(this._moveHistory[i]) + " ";
    }
    return mh;
};

Game.prototype.load_move_history = function (ygn) {
    var ygnArray = ygn.split("\r\n");
    var fen = ygnArray[0].substr(1, ygnArray[0].length - 2);
    var mvsArray = ygnArray[1].split(" ");
    this.load_fen(fen);
    var s = this._curSide;
    for(var i = 0 ; i < mvsArray.length; i++) {
        var n = mvsArray[i];
        if(n.length === 2 && n.indexOf(".") < 0) {
            var m = MOVE_FROM_NAME(s, n);
            s ^= 3;
            this.make_move(m);
        }
    }
    this.check_game_over();
    this._ui.update();
};

Game.prototype.tuncate = function () {
    this._moveHistory.splice(this._playOrder, this._moveOrder - this._playOrder);
    this._moveOrder = this._playOrder;
};

Game.prototype.chang_side = function () {
    this._curSide ^= 3;
};

Game.prototype.check_dir = function (idx, dir) {
    var wCount = 0;
    var bCount = 0;
    var side = this._board._stones[idx];
    var curIdx;
    curIdx = idx + dir;
    while (curIdx < HEX_NUM) {
        if (this._board._stones[curIdx] !== STONE.EMPTY &&
            side === this._board._stones[curIdx]) {
            if (this._board._stones[curIdx] === STONE.WHITE) {
                wCount++;
            } else {
                bCount++;
            }
        } else {
            break;
        }
        if (this._board._mask[curIdx] === 0) {
            break;
        }
        curIdx += dir;
    }
    if (wCount >= 2) {
        return wCount === 2 ? RESULT_STA.WHITE_THREE : RESULT_STA.WHITE_FOUR;
    }
    if (bCount >= 2) {
        return bCount === 2 ? RESULT_STA.BLACK_THREE : RESULT_STA.BLACK_FOUR;
    }
    return RESULT_STA.NONE;
};

Game.prototype.check_game_over = function () {
    var s = RESULT.NONE;
    var count = 0;
    var wThreeCount = 0;
    var bThreeCount = 0;
    for (var idx = 0; idx < HEX_NUM; idx++) {
        if (this._board._stones[idx] !== STONE.EMPTY) {
            // 检测从左到右
            s = this.check_dir(idx, DIR.RIGHT);
            if (s !== RESULT_STA.NONE) {
                if (s === RESULT_STA.WHITE_FOUR || s === RESULT_STA.BLACK_FOUR) {
                    this._isGameOver = s;
                    return s;
                } else {
                    if (s == RESULT_STA.WHITE_THREE) {
                        wThreeCount++;
                    } else {
                        bThreeCount++;
                    }
                }
            }
            // 检测从右上到左下
            s = this.check_dir(idx, DIR.LEFT_DOWN);
            if (s !== RESULT_STA.NONE) {
                if (s === RESULT_STA.WHITE_FOUR || s === RESULT_STA.BLACK_FOUR) {
                    this._isGameOver = s;
                    return s;
                } else {
                    if (s == RESULT_STA.WHITE_THREE) {
                        wThreeCount++;
                    } else {
                        bThreeCount++;
                    }
                }
            }
            // 检测从左上到右下
            s = this.check_dir(idx, DIR.RIGHT_DOWN);
            if (s !== RESULT_STA.NONE) {
                if (s === RESULT_STA.WHITE_FOUR || s === RESULT_STA.BLACK_FOUR) {
                    this._isGameOver = s;
                    return s;
                } else {
                    if (s == RESULT_STA.WHITE_THREE) {
                        wThreeCount++;
                    } else {
                        bThreeCount++;
                    }
                }
            }
            count++;
        }
    }
    if (wThreeCount > 0) {
        this._isGameOver = STONE.BLACK;
        return STONE.BLACK;
    } else if (bThreeCount > 0) {
        this._isGameOver = STONE.WHITE;
        return STONE.WHITE;
    }
    if (count === 61) {
        this._isGameOver = RESULT.DRAW;
        return RESULT.DRAW;
    }
    this._isGameOver = RESULT.NONE;
    return s;
};

Game.prototype.make_move = function (m) {
    this._moveHistory.push(m);
    this._moveOrder++;
    this._board.make_move(m);
    this._playOrder = this._moveOrder;
    this._lastIdx = MOVE_IDX(m);
    this.chang_side();
};
//
//Game.prototype.unmake_move = function () {
//    var m = this._moveHistory.pop();
//    this._moveOrder--;
//    this._playOrder = this._moveOrder;
//    this._board.unmake_move(m);
//    this._lastIdx = MOVE_IDX(m);
//    this.chang_side();
//};

Game.prototype.play_next_move = function () {
    if (this._playOrder === this._moveOrder) {
        return;
    }
    var m = this._moveHistory[this._playOrder++];
    this._board.make_move(m);
    this._lastIdx = MOVE_IDX(m);
    this.chang_side();
    this.check_game_over();
    this._ui.update();
};

Game.prototype.play_prev_move = function () {
    if (this._playOrder < 1) {
        return;
    }
    var m = this._moveHistory[--this._playOrder];
    if (this._playOrder === 1 && MOVE_IDX(m) === MOVE_IDX(this._moveHistory[this._playOrder - 1])) {
        this._board.unmake_swap_move(m);
    } else {
        this._board.unmake_move(m);
    }
    this._lastIdx = this._playOrder === 0 ? -1 : MOVE_IDX(this._moveHistory[this._playOrder - 1]);
    this.chang_side();
    this.check_game_over();
    this._ui.update();
};

Game.prototype.play_first_move = function () {
    while (this._playOrder > 0) {
        var m = this._moveHistory[--this._playOrder];
        this._board.unmake_move(m);
        this._lastIdx = this._playOrder === 0 ? -1 : MOVE_IDX(this._moveHistory[this._playOrder - 1]);
        this.chang_side();
    }
    this.check_game_over();
    this._ui.update();
};

Game.prototype.play_last_move = function () {
    while (this._playOrder < this._moveOrder) {
        var m = this._moveHistory[this._playOrder++];
        this._board.make_move(m);
        this._lastIdx = MOVE_IDX(m);
        this.chang_side();
    }
    this.check_game_over();
    this._ui.update();
};

Game.prototype.swap = function () {
    var m = this._moveHistory[0];
    m = MOVE(this._curSide, MOVE_IDX(m));
    this.make_move(m);
    this._ui.update();
};

Game.prototype.test = function () {
    if(this._isGameOver) {
        return;
    }
    this._ai.test(this._board, this._curSide);
};
