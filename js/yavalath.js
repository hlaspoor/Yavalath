"use strict";

$(function () {
    var game = new Game();
    //game.restart();
    game.loadFen("5/6/2w4/2b2b2/3bwwbw1/3wb3/3b3/2w3/5 w");

    var ai = new AI(game);
    var mvs = ai.generateMoves();
    for(var i = 0; i < mvs.length; i++) {
        console.log(MOVE_NAME(mvs[i]));
    }

});
