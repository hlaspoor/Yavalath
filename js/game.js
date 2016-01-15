"use strict";

function Game() {
    this._ui = new UI(this);
    this._board = new Board();
    this._curSide = EMPTY;
    this._lastIdx = -1;
}

Game.prototype.init = function () {
    this._ui.init();
};

Game.prototype.restart = function () {
    this._board.reset();
    this._curSide = WHITE;
    this._lastIdx = -1;
};

Game.prototype.changSide = function () {
    this._curSide ^= 3;
};

Game.prototype.onCellClick = function (idx) {
    var m = MOVE(this._curSide, idx);
    this._board.makeMove(m);
    this._lastIdx = idx;
    this.changSide();
    this._ui.update(this._board);
};
