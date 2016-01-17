"use strict";

function UI(g) {
    this._game = g;
    $(".hexagon[id^='h']").mousedown(function () {
        var idx = parseInt(this.id.slice(1));
        g.onCellClick(idx);
    });
}

UI.prototype.update = function () {
    var g = this._game;
    var dot = $(".dot");
    $(".hexagon[id^='h']").each(function () {
        var idx = parseInt(this.id.slice(1));
        var stone = $(this).find(".stone");
        stone.removeClass("white black");
        if (g._board._stones[idx] === STONE.WHITE) {
            stone.addClass("white");
            stone.fadeIn(FADE_SPEED);
        } else if (g._board._stones[idx] === STONE.BLACK) {
            stone.addClass("black");
            stone.fadeIn(FADE_SPEED);
        }
        if (g._lastIdx === idx) {
            stone.prepend(dot);
        }
    });
    this.showYpn();
};

UI.prototype.showYpn = function () {
    $("#ypn").html(this._game.getFen());
};
