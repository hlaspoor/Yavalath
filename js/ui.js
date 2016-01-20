"use strict";

function UI(g) {
    var ui = this;
    this._game = g;
    $(".hex[id^='h']").mousedown(function () {
        var idx = parseInt(this.id.slice(1));
        ui.on_cell_click(idx);
    });
    // 设置选项
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

    // 回放控制
    $("#btn_prev").click(function () {
        g.play_prev_move();
    });
    $("#btn_next").click(function () {
        g.play_next_move();
    });
    $("#btn_first").click(function () {
        g.play_first_move();
    });
    $("#btn_last").click(function () {
        g.play_last_move();
    });
    $("#btn_test").click(function () {
        g.test();
    });

    $("#btn_load_fen").click(function () {
        g.load_fen($('#txt_fen').val());
    });
}

// 更新棋盘
UI.prototype.update = function () {
    var g = this._game;
    var dot = $(".dot");
    // 先把高亮走法的dot归为
    $("#board").append(dot);
    $(".hex[id^='h']").each(function () {
        var idx = parseInt(this.id.slice(1));
        var stone = $(this).find(".stone");
        var num = stone.find(".stone_num");
        var tmp_num = 0;
        if (g._board._stones[idx] === STONE.WHITE) {
            tmp_num = g._moveHistory.indexOf(MOVE(STONE.WHITE, idx)) + 1;
            stone.removeClass("white black");
            stone.addClass("white");
            num.html(tmp_num > 0 ? tmp_num : "");
            $(this).css("cursor", "default");
            stone.fadeIn(FADE_SPEED);
        } else if (g._board._stones[idx] === STONE.BLACK) {
            tmp_num = g._moveHistory.indexOf(MOVE(STONE.BLACK, idx)) + 1;
            stone.removeClass("white black");
            stone.addClass("black");
            num.html(tmp_num > 0 ? tmp_num : "");
            stone.fadeIn(FADE_SPEED);
            $(this).css("cursor", "default");
        } else {
            stone.fadeOut(FADE_SPEED, function () {
                stone.removeClass("white black");
            });
            $(this).css("cursor", g._isGameOver ? "default" : "pointer");
        }
        if (g._lastIdx === idx) {
            stone.prepend(dot);
        }
    });

    this.show_fen();
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

UI.prototype.show_fen = function () {
    $("#fen").html(this._game.get_fen());
};


UI.prototype.on_cell_click = function (idx) {
    if (this._game._board._stones[idx] !== STONE.EMPTY) {
        return;
    }
    if (this._game._isGameOver) {
        return;
    }
    if (this._game._playOrder !== this._game._moveOrder) {
        // 移除该播放节点以后的所有走法后再加入新的走法
        this._game._moveHistory.splice(this._game._playOrder, this._game._moveOrder - this._game._playOrder);
        this._game._moveOrder = this._game._playOrder;
    }
    var m = MOVE(this._game._curSide, idx);
    this._game.make_move(m);
    this.update();
    // 检测是否有一方获胜
    if (this._game.check_game_over() !== STONE.EMPTY) {
        this.update();
        setTimeout(function () {
            alert("GAME OVER");
        }, FADE_DELAY);
        return;
    }
};
