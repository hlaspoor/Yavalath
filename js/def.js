"use strict";

var HEX_NUM = 81;
var HEX_NUM_HALF = 9;

var STONE = {
    EMPTY: 0,
    WHITE: 1,
    BLACK: 2
};

var COORD_X_CHAR = "ABCDEFGHI";
var COORD_Y_CHAR = "123456789";

var DIR = {
    RIGHT: 1,
    LEFT_DOWN: 9,
    RIGHT_DOWN: 10,
    LEFT: -1,
    LEFT_UP: -10,
    RIGHT_UP: -9
};

var FADE_SPEED = 240;

function XY2IDX(x, y) {
    return x * 9 + y;
}

function IDX2X(idx) {
    return parseInt(idx / 9);
}

function IDX2Y(idx) {
    return parseInt(idx % 9);
}

function MOVE(s, idx) {
    return parseInt((s << 7) | idx);
}

function MOVE_IDX(m) {
    return parseInt(m & 0x7F);
}

function MOVE_STONE(m) {
    return parseInt((m >> 7) & 0x3);
}

function MOVE_NAME(m) {
    var idx = MOVE_IDX(m);
    return COORD_X_CHAR[IDX2X(idx)] + COORD_Y_CHAR[IDX2Y(idx)];
}
