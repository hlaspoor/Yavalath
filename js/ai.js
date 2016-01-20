"use strict";

function Ai() {
    this._curSide = STONE.EMPTY;
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
    this._moveGen = new MoveGen(this);
}

Ai.prototype.clone_board = function (b) {
    for (var idx = 0; idx < HEX_NUM; idx++) {
        this._stones[idx] = b._stones[idx];
    }
};

Ai.prototype.change_side = function () {
    this._curSide ^= 3;
};

Ai.prototype.make_move = function (m) {
    this._stones[MOVE_IDX(m)] = MOVE_STONE(m);
    this.change_side();
};

Ai.prototype.unmake_move = function () {
    this.change_side();
};

Ai.prototype.test = function (b, s) {
    this.clone_board(b);
    this._curSide = s;
    var mvs = this._moveGen.generate_moves(this);
    var output = [];
    for(var i = 0; i < mvs.length; i++) {
        output.push(MOVE_NAME(mvs[i]));
    }
    console.log(output);
};
