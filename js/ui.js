"use strict";

function UI(g) {
    this._inAnimation = false;
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
        ui.update_swap();
    });

    // 回放控制
    $("#btn_prev").click(function () {
        if (ui._inAnimation) {
            return;
        }
        g.play_prev_move();
    });
    $("#btn_next").click(function () {
        if (ui._inAnimation) {
            return;
        }
        g.play_next_move();
    });
    $("#btn_first").click(function () {
        if (ui._inAnimation) {
            return;
        }
        g.play_first_move();
    });
    $("#btn_last").click(function () {
        if (ui._inAnimation) {
            return;
        }
        g.play_last_move();
    });

    $("#btn_swap").click(function () {
        if (g._playOrder !== g._moveOrder) {
            // 移除该播放节点以后的所有走法后再加入新的走法
            g.tuncate();
        }
        g.swap();
    });

    $("#btn_test").click(function () {
        g.test();
    });

    $("#btn_load_fen").click(function () {
        g.load_fen($('#txt_fen').val());
        g.check_game_over();
        g._ui.update();
    });

    $("#btn_save_move_history").click(function () {
        var mh = g.get_move_history();
        var blob = new Blob([mh], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "test.ygn");
    });

    $("#btn_load_move_history").click(function () {
        $("#btn_load_game").click();
    });

    $("#btn_load_game").change(function () {
        var reader = new FileReader();
        reader.onload = function () {
            $("#btn_load_game").val("");
            var ygn = reader.result.toString();
            g.load_move_history(ygn);
        };
        reader.readAsText(this.files[0], "UTF-8");
    });
}

// 更新棋盘
UI.prototype.update = function () {
    var ui = this;
    var g = this._game;
    var dot = $(".dot");
    // 先把高亮走法的dot归为
    $("#board").append(dot);
    $(".hex[id^='h']").each(function () {
        var idx = parseInt(this.id.slice(1));
        var stone = $(this).find(".stone");
        var num = stone.find(".stone_num");
        var tmpNum = 0;
        var tmpNumLast = 0;
        if (g._board._stones[idx] === STONE.WHITE) {
            tmpNum = g._moveHistory.indexOf(MOVE(STONE.WHITE, idx)) + 1;
            tmpNumLast = g._moveHistory.indexOf(MOVE(STONE.BLACK, idx)) + 1;
            if (tmpNum > 0) {
                if (tmpNumLast > 0) {
                    if (tmpNum > tmpNumLast) {
                        num.html("&#189;");
                    } else {
                        ui._inAnimation = true;
                        stone.fadeOut(FADE_SPEED, function () {
                            num.html(tmpNum);
                            stone.removeClass("white black");
                            stone.addClass("white");
                            $(this).css("cursor", "default");
                            stone.fadeIn(FADE_SPEED, function () {
                                ui._inAnimation = false;
                            });
                            if (g._lastIdx === idx) {
                                stone.prepend(dot);
                            }
                        });
                        return;
                    }
                } else {
                    num.html(tmpNum);
                }
            } else {
                num.html("");
            }
            stone.removeClass("white black");
            stone.addClass("white");
            $(this).css("cursor", "default");
            ui._inAnimation = true;
            stone.fadeIn(FADE_SPEED, function () {
                ui._inAnimation = false;
            });
        } else if (g._board._stones[idx] === STONE.BLACK) {
            tmpNum = g._moveHistory.indexOf(MOVE(STONE.BLACK, idx)) + 1;
            tmpNumLast = g._moveHistory.indexOf(MOVE(STONE.WHITE, idx)) + 1;
            if (tmpNum > 0) {
                if (tmpNumLast > 0) {
                    if (tmpNum > tmpNumLast) {
                        if (g._playOrder === 2 && stone.hasClass("white")) {
                            ui._inAnimation = true;
                            stone.fadeOut(FADE_SPEED, function () {
                                num.html("&#189;");
                                stone.removeClass("white black");
                                stone.addClass("black");
                                $(this).css("cursor", "default");
                                stone.fadeIn(FADE_SPEED, function () {
                                    ui._inAnimation = false;
                                });
                                if (g._lastIdx === idx) {
                                    stone.prepend(dot);
                                }
                            });
                            return;
                        }
                    } else {
                        num.html(tmpNum);
                    }
                } else {
                    num.html(tmpNum);
                }
            } else {
                num.html("");
            }
            ui._inAnimation = true;
            stone.removeClass("white black");
            stone.addClass("black");
            $(this).css("cursor", "default");
            stone.fadeIn(FADE_SPEED, function () {
                ui._inAnimation = false;
            });
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
    this.update_swap();
    this.update_result();
};

// 更新回放按钮的状态
UI.prototype.update_playback = function () {
    var btnPrev = $("#btn_prev");
    var btnNext = $("#btn_next");
    var btnFirst = $("#btn_first");
    var btnLast = $("#btn_last");
    if (this._game._moveOrder === 0) {
        btnPrev.prop('disabled', true);
        btnFirst.prop('disabled', true);
        btnNext.prop('disabled', true);
        btnLast.prop('disabled', true);
    } else {
        if (this._game._playOrder === 0) {
            btnPrev.prop('disabled', true);
            btnFirst.prop('disabled', true);
            btnNext.prop('disabled', false);
            btnLast.prop('disabled', false);
        } else if (this._game._playOrder === this._game._moveOrder) {
            btnPrev.prop('disabled', false);
            btnFirst.prop('disabled', false);
            btnNext.prop('disabled', true);
            btnLast.prop('disabled', true);
        } else {
            btnPrev.prop('disabled', false);
            btnFirst.prop('disabled', false);
            btnNext.prop('disabled', false);
            btnLast.prop('disabled', false);
        }
    }
};

UI.prototype.update_result = function () {
    var divResult = $("#game_result");
    if (this._game._isGameOver !== RESULT.NONE) {
        var result = "GAME OVER, ";
        if (this._game._isGameOver === RESULT.WHITE) {
            result += "WHITE WINS!";
        } else if (this._game._isGameOver === RESULT.BLACK) {
            result += "BLACK WINS!";
        } else {
            result += "DRAW!";
        }
        divResult.html(result);
        divResult.slideDown(FADE_SPEED);
    } else {
        divResult.slideUp(FADE_SPEED);
    }
};

UI.prototype.update_swap = function () {
    var btnSwap = $("#btn_swap");
    if (this._game._board.get_stones_count() === 1 &&
        this._game._playOrder <= 1 &&
        this._game._allowSwap) {
        btnSwap.prop('disabled', false);
    } else {
        btnSwap.prop('disabled', true);
    }
};

UI.prototype.show_fen = function () {
    $("#fen").html(this._game.get_fen());
};

UI.prototype.on_cell_click = function (idx) {
    if (this._game._board._stones[idx] !== STONE.EMPTY) {
        return;
    }
    if (this._game._isGameOver !== RESULT.NONE) {
        return;
    }
    if (this._game._playOrder !== this._game._moveOrder) {
        // 移除该播放节点以后的所有走法后再加入新的走法
        this._game.tuncate();
    }
    var m = MOVE(this._game._curSide, idx);
    this._game.make_move(m);
    this.update();
    // 检测是否有一方获胜
    if (this._game.check_game_over() !== STONE.EMPTY) {
        this.update();
    }
};
