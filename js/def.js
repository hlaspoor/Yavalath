"use strict";

var HEX_NUM = 81;
var HEX_NUM_HALF = 9;

var STONE = {
    "EMPTY": 0,
    "WHITE": 1,
    "BLACK": 2
};

var RESULT = {
    "NONE": 0,
    "WHITE": 1,
    "BLACK": 2,
    "DRAW": 3
};

var RESULT_STA = {
    "NONE": 0,
    "WHITE_FOUR": 1,
    "BLACK_FOUR": 2,
    "WHITE_THREE": 4,
    "BLACK_THREE": 5
};

var COORD_X_CHAR = "ABCDEFGHI";
var COORD_Y_CHAR = "123456789";

var DIR = {
    "RIGHT": 1,
    "LEFT_DOWN": 9,
    "RIGHT_DOWN": 10,
    "LEFT": -1,
    "LEFT_UP": -10,
    "RIGHT_UP": -9
};

var FADE_SPEED = 160;
//var FADE_DELAY = 220;

function XY_TO_IDX(x, y) {
    return x * 9 + y;
}

function IDX_TO_X(idx) {
    return parseInt(idx / 9);
}

function IDX_TO_Y(idx) {
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
    return COORD_X_CHAR[IDX_TO_X(idx)] + COORD_Y_CHAR[IDX_TO_Y(idx)];
}

function MOVE_FROM_NAME(s, n) {
    var x = parseInt(n[0].charCodeAt(0) - 65);
    var y = parseInt(n[1]) - 1;
    var idx = XY_TO_IDX(x, y);
    return MOVE(s, idx);
}

function RESULT_NAME(r) {
    switch (r) {
        case RESULT.NONE:
            return "*";
        case RESULT.WHITE:
            return "1-0";
        case RESULT.BLACK:
            return "0-1";
        case RESULT.DRAW:
            return "1/2-1/2";
    }
    return "*";
}
