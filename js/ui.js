"use strict";

function UI(g) {
    this._game = g;
    $(".hex[id^='h']").mousedown(function () {
        var idx = parseInt(this.id.slice(1));
        g.on_cell_click(idx);
    });
    $("#chk_show_move_order").change(function () {
        var show = this.checked;
        $(".stone_num").each(function () {
            $(this).css("display", (show ? "block" : "none"));
        });
    });
    $("#chk_show_last_move").change(function () {
        var show = this.checked;
        $(".dot").css("display", (show ? "block" : "none"));
    });
}

UI.prototype.update = function () {
    var g = this._game;
    var dot = $(".dot");
    $(".hex[id^='h']").each(function () {
        var idx = parseInt(this.id.slice(1));
        var stone = $(this).find(".stone");
        var num = stone.find(".stone_num");
        stone.removeClass("white black");
        if (g._board._stones[idx] === STONE.WHITE) {
            stone.addClass("white");
            $(this).css("cursor", "default");
            stone.fadeIn(FADE_SPEED);
        } else if (g._board._stones[idx] === STONE.BLACK) {
            stone.addClass("black");
            stone.fadeIn(FADE_SPEED);
            $(this).css("cursor", "default");
        } else {
            $(this).css("cursor", "pointer");
        }
        if (g._lastIdx === idx) {
            stone.prepend(dot);
            num.html(++g._iidx);
        }
    });
    this.show_ypn();
};

UI.prototype.show_ypn = function () {
    $("#ypn").html(this._game.get_fen());
};
