"use strict";

$(function () {
    var g = new Game();
    //g.restart();
    g.loadFen("5/6/2w4/2b2b2/3bwwbw1/3wb3/3b3/2w3/5 w");

    //var ai = new AI(g);
    var mvs = g.generateMoves();
    for (var i = 0; i < mvs.length; i++) {
        console.log(MOVE_NAME(mvs[i]));
    }
});
