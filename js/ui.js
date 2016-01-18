"use strict";

function UI(g) {
    this._game = g;
    $(".hex[id^='h']").mousedown(function () {
        var idx = parseInt(this.id.slice(1));
        g.on_cell_click(idx);
    });
}

UI.prototype.update = function () {
    var g = this._game;
    var dot = $(".dot");
    $(".hex[id^='h']").each(function () {
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
    this.show_ypn();
};

UI.prototype.show_ypn = function () {
    $("#ypn").html(this._game.get_fen());
};
