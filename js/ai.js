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
    this._openning = [
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 0, 0, 0, 0,
        0, 1, 2, 2, 2, 1, 0, 0, 0,
        0, 1, 2, 0, 0, 2, 1, 0, 0,
        0, 1, 2, 0, 0, 0, 2, 1, 0,
        0, 0, 1, 2, 0, 0, 2, 1, 0,
        0, 0, 0, 1, 2, 2, 2, 1, 0,
        0, 0, 0, 0, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    this._swap = [
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 1, 0, 0, 0,
        0, 0, 1, 1, 1, 1, 1, 0, 0,
        0, 0, 0, 1, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    this._moveGen = new MoveGen(this);
}

Ai.prototype.clone_board = function (b) {
    for (var idx = 0; idx < HEX_NUM; idx++) {
        this._stones[idx] = b._stones[idx];
    }
};

Ai.prototype.get_stones_count = function () {
    var count = 0;
    for (var idx = 0; idx < HEX_NUM; idx++) {
        if (this._stones[idx] !== STONE.EMPTY) {
            count++;
        }
    }
    return count;
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
    var idx;
    var m;
    var count = this.get_stones_count();
    if (count === 0) {
        // get first move
        var openArray = [];
        for (idx = 0; idx < HEX_NUM; idx++) {
            if (this._openning[idx] >= 1) {
                openArray.push(idx);
            }
        }
        var rndIdx = parseInt(Math.random() * openArray.length);
        m = MOVE(s, openArray[rndIdx]);
        console.log(MOVE_NAME(m));
        return;
    } else if (count === 1) {
        // check whether should swap move
        for (idx = 0; idx < HEX_NUM; idx++) {
            if (this._stones[idx] !== STONE.EMPTY && this._swap[idx] === 1) {
                console.log("Should Swap!");
                return;
            }
        }
    }
    console.log("其他走法");
    var mvs = this._moveGen.generate_moves(this);
    var output = [];
    for (var i = 0; i < mvs.length; i++) {
        output.push(MOVE_NAME(mvs[i]));
    }
    console.log(output);
};
