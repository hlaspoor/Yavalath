"use strict";

function Game() {
    this._ui = new UI(this);
    this._board = new Board();
    this._curSide = STONE.EMPTY;
    this._lastIdx = -1;
    this._allowSwap = true;
    this._moveHistory = [];
    this._moveOrder = 0;
    this._playOrder = 0;
    this._ai = new Ai();
}

Game.prototype.reset = function () {
    this._board.reset();
    this._curSide = STONE.WHITE;
    this._lastIdx = -1;
    this._moveHistory = [];
    this._moveOrder = 0;
    this._playOrder = 0;
};

Game.prototype.new_game = function () {
    this.reset();
    this._ui.update();
};

Game.prototype.load_fen = function (fen) {
    var fenArray = fen.split(" ");
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
    this._ui.update();
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

Game.prototype.chang_side = function () {
    this._curSide ^= 3;
};

//Game.prototype.checkGameOver = function () {
//
//    return STONE.EMPTY;
//};

Game.prototype.make_move = function (m) {
    this._board.make_move(m);
    this._moveHistory.push(m);
    this._moveOrder++;
    this._playOrder = this._moveOrder;
    this._lastIdx = MOVE_IDX(m);
    this.chang_side();
};

Game.prototype.unmake_move = function () {
    var m = this._moveHistory.pop();
    this._moveOrder--;
    this._playOrder = this._moveOrder;
    this._board.unmake_move(m);
    this._lastIdx = MOVE_IDX();
    this.chang_side();
};

Game.prototype.play_next_move = function () {
    if (this._playOrder === this._moveOrder) {
        return;
    }
    var m = this._moveHistory[this._playOrder++];
    this._board.make_move(m);
    this._lastIdx = MOVE_IDX(m);
    this.chang_side();
    this._ui.update();
};

Game.prototype.play_prev_move = function () {
    if (this._playOrder < 1) {
        return;
    }
    var m = this._moveHistory[--this._playOrder];
    this._board.unmake_move(m);
    this._lastIdx = MOVE_IDX(this._moveHistory[this._playOrder - 1]);
    this.chang_side();
    this._ui.update();
};

Game.prototype.play_first_move = function () {
    while (this._playOrder > 0) {
        var m = this._moveHistory[--this._playOrder];
        this._board.unmake_move(m);
        this._lastIdx = MOVE_IDX(this._moveHistory[this._playOrder - 1]);
        this.chang_side();
    }
    this._ui.update();
};

Game.prototype.play_last_move = function () {
    while (this._playOrder < this._moveOrder) {
        var m = this._moveHistory[this._playOrder++];
        this._board.make_move(m);
        this._lastIdx = MOVE_IDX(m);
        this.chang_side();
    }
    this._ui.update();
};

Game.prototype.swap = function () {
    this._board.swap();
    this.chang_side();
};

Game.prototype.on_cell_click = function (idx) {
    if (this._board._stones[idx] !== STONE.EMPTY) {
        return;
    }
    if (this._playOrder !== this._moveOrder) {
        // 移除该播放节点以后的所有走法后再加入新的走法
        this._moveHistory.splice(this._playOrder, this._moveOrder - this._playOrder);
        this._moveOrder = this._playOrder;
    }
    var m = MOVE(this._curSide, idx);
    this.make_move(m);
    this._ui.update();
};

Game.prototype.test = function () {
    this._ai.test(this._board, this._curSide);
};
