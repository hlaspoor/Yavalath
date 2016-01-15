"use strict";

function UI(game) {
    this._game = game;

    var g = this._game;
    $(".hexagon[id^='h']").mousedown(function () {
        var idx = parseInt(this.id.slice(1));
        g.onCellClick(idx);
    });
}

UI.prototype.update = function() {
    var g = this._game;
    var dot = $(".dot");
    $(".hexagon[id^='h']").each(function() {
        var idx = parseInt(this.id.slice(1));
        var stone = $(this).find(".stone");
        stone.removeClass("white black");
        if(g._board._stones[idx] === WHITE) {
            stone.addClass("white");
            stone.fadeIn(200);
        } else if(g._board._stones[idx] === BLACK) {
            stone.addClass("black");
            stone.fadeIn(200);
        }
        if(g._lastIdx === idx) {
            stone.prepend(dot);
        }
    });
};
