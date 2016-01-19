"use strict";

function Board() {
    this._mask = [
        3, 3, 3, 3, 3, 0, 0, 0, 0,
        3, 3, 3, 3, 3, 3, 0, 0, 0,
        3, 3, 3, 3, 3, 3, 3, 0, 0,
        3, 3, 3, 3, 3, 3, 3, 3, 0,
        3, 3, 3, 3, 3, 3, 3, 3, 3,
        0, 3, 3, 3, 3, 3, 3, 3, 3,
        0, 0, 3, 3, 3, 3, 3, 3, 3,
        0, 0, 0, 3, 3, 3, 3, 3, 3,
        0, 0, 0, 0, 3, 3, 3, 3, 3
    ];
    this._stones = [
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    this._edge = [
        3, 3, 3, 3, 3, 0, 0, 0, 0,
        3, 0, 0, 0, 0, 3, 0, 0, 0,
        3, 0, 0, 0, 0, 0, 3, 0, 0,
        3, 0, 0, 0, 0, 0, 0, 3, 0,
        3, 0, 0, 0, 0, 0, 0, 0, 3,
        0, 3, 0, 0, 0, 0, 0, 0, 3,
        0, 0, 3, 0, 0, 0, 0, 0, 3,
        0, 0, 0, 3, 0, 0, 0, 0, 3,
        0, 0, 0, 0, 3, 3, 3, 3, 3
    ];
}

Board.prototype.reset = function () {
    for (var idx = 0; idx < HEX_NUM; idx++) {
        this._stones[idx] = STONE.EMPTY;
    }
};

Board.prototype.make_move = function (m) {
    this._stones[MOVE_IDX(m)] = MOVE_STONE(m);
};

Board.prototype.unmake_move = function (m) {
    this._stones[MOVE_IDX(m)] = STONE.EMPTY;
};

Board.prototype.swap = function () {
    for (var idx = 0; idx < HEX_NUM; idx++) {
        if(this._stones[idx] !== STONE.EMPTY) {
            this._stones[idx] ^= 3;
        }
    }
};
