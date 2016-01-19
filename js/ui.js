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
    $("#chk_allow_swap").change(function () {
        g._allowSwap = this.checked;
    });

    $('#btn_prev').click(function () {
        g.play_prev_move();
    });
    $('#btn_next').click(function () {
        g.play_next_move();
    });
    $('#btn_first').click(function () {
        g.play_first_move();
    });
    $('#btn_last').click(function () {
        g.play_last_move();
    });
    $('#btn_test').click(function () {
        g.test();
    });
}

// 更新棋盘
UI.prototype.update = function () {
    var g = this._game;
    var dot = $(".dot");
    $(".hex[id^='h']").each(function () {
        var idx = parseInt(this.id.slice(1));
        var stone = $(this).find(".stone");
        var num = stone.find(".stone_num");
        var tmp_num = 0;
        if (g._board._stones[idx] === STONE.WHITE) {
            tmp_num = g._moveHistory.indexOf(MOVE(STONE.WHITE, idx)) + 1;
            stone.addClass("white");
            num.html(tmp_num > 0 ? tmp_num : "");
            $(this).css("cursor", "default");
            stone.fadeIn(FADE_SPEED);
        } else if (g._board._stones[idx] === STONE.BLACK) {
            tmp_num = g._moveHistory.indexOf(MOVE(STONE.BLACK, idx)) + 1;
            stone.addClass("black");
            num.html(tmp_num > 0 ? tmp_num : "");
            stone.fadeIn(FADE_SPEED);
            $(this).css("cursor", "default");
        } else {
            stone.fadeOut(FADE_SPEED, function () {
                stone.removeClass("white black");
            });
            $(this).css("cursor", "pointer");
        }
        if (g._lastIdx === idx) {
            stone.prepend(dot);
        }
    });

    this.show_ypn();
    this.update_playback();
};

// 更新回放按钮的状态
UI.prototype.update_playback = function () {
    if (this._game._moveOrder === 0) {
        $("#btn_prev").prop('disabled', true);
        $("#btn_first").prop('disabled', true);
        $("#btn_next").prop('disabled', true);
        $("#btn_last").prop('disabled', true);
    } else {
        if (this._game._playOrder === 0) {
            $("#btn_prev").prop('disabled', true);
            $("#btn_first").prop('disabled', true);
            $("#btn_next").prop('disabled', false);
            $("#btn_last").prop('disabled', false);
        } else if (this._game._playOrder === this._game._moveOrder) {
            $("#btn_prev").prop('disabled', false);
            $("#btn_first").prop('disabled', false);
            $("#btn_next").prop('disabled', true);
            $("#btn_last").prop('disabled', true);
        } else {
            $("#btn_prev").prop('disabled', false);
            $("#btn_first").prop('disabled', false);
            $("#btn_next").prop('disabled', false);
            $("#btn_last").prop('disabled', false);
        }
    }
};

UI.prototype.show_ypn = function () {
    $("#ypn").html(this._game.get_fen());
};
