"use strict";

var EMPTY = 0;
var WHITE = 1;
var BLACK = 2;

function MOVE(s, idx) {
    return parseInt((s << 7) | idx);
}

function MOVEIDX(m) {
    return parseInt(m & 0x7F);
}

function MOVESTONE(m) {
    return parseInt((m >> 7) & 0x3);
}
