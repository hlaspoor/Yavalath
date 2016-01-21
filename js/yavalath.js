"use strict";

$(function () {
    $("#page_right_container").mCustomScrollbar({
        theme: "minimal-dark",
        scrollInertia: 0
    });

    var g = new Game();
    g.new_game();

    // wbbww/bbwwbb/bwwbbwb/wwbwwbww/bbwbbwwbb/wwbwwbww/bwbbwbb/bbwb1w/wwbww b
    //var ai = new AI(g);
    //var mvs = g.generate_moves();
    //for (var i = 0; i < mvs.length; i++) {
    //    console.log(MOVE_NAME(mvs[i]));
    //}
});
