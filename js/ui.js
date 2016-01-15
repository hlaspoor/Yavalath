"use strict";

function UI(game) {
    this._game = game;
}

UI.prototype.init = function () {
    var g = this._game;
    $(".hexagon[id^='h']").mousedown(function () {
        var idx = parseInt(this.id.slice(1));
        g.onCellClick(idx);
    });
};

UI.prototype.update = function(b) {
    var g = this._game;
    var dot = $(".dot");
    $(".hexagon[id^='h']").each(function() {
        var idx = parseInt(this.id.slice(1));
        var stone = $(this).find(".stone");
        stone.removeClass("white black");
        if(b._stones[idx] === WHITE) {
            stone.addClass("white");
        } else if(b._stones[idx] === BLACK) {
            stone.addClass("black");
        }
        if(g._lastIdx === idx) {
            stone.prepend(dot);
        }
    });
};
