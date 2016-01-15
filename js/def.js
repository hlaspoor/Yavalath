"use strict";

var EMPTY = 0;
var WHITE = 1;
var BLACK = 2;

function XY2IDX(x, y) {
    return x * 9 + y;
}

function IDX2X(idx) {
    return parseInt(x / 9);
}

function IDX2Y(idx) {
    return parseInt(idx % 9);
}

function MOVE(s, idx) {
    return parseInt((s << 7) | idx);
}

function MOVEIDX(m) {
    return parseInt(m & 0x7F);
}

function MOVESTONE(m) {
    return parseInt((m >> 7) & 0x3);
}
