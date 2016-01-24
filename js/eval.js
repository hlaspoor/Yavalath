"use strict";

function Eval(ai) {
    this._ai = ai;
    this._posVal = [
        1, 1, 1, 1, 1, 0, 0, 0, 0,
        1, 9, 9, 9, 9, 1, 0, 0, 0,
        1, 9, 25, 25, 25, 9, 1, 0, 0,
        1, 9, 25, 49, 49, 25, 9, 1, 0,
        1, 9, 25, 49, 81, 49, 25, 9, 1,
        0, 1, 9, 25, 49, 49, 25, 9, 1,
        0, 0, 1, 9, 25, 25, 25, 9, 1,
        0, 0, 0, 1, 9, 9, 9, 9, 1,
        0, 0, 0, 0, 1, 1, 1, 1, 1
    ];
    this._attackVal = 500;
}

Eval.prototype.check_dir_attack = function (idx, dir) {
    var stones = this._ai._stones;
    var mask = this._ai._mask;
    var side = stones[idx];
    // 检测方向上的后面三个位置都在棋盘内
    if (idx + dir * 3 < HEX_NUM &&
        mask[idx + dir] !== 0 &&
        mask[idx + dir * 2] !== 0 &&
        mask[idx + dir * 3] !== 0) {
        if (stones[idx + dir] === side &&
            stones[idx + dir * 2] === STONE.EMPTY &&
            stones[idx + dir * 3] === side) {
            // 判断 ooxo 棋型的冲三
            return true;
        }
        else if (stones[idx + dir] === STONE.EMPTY &&
            stones[idx + dir * 2] === side &&
            stones[idx + dir * 3] === side) {
            // 判断 oxoo 棋型的冲三
            return true;
        }
    }
    return false;
};

Eval.prototype.eval_board = function () {
    var stones = this._ai._stones;
    var wScore = 0;
    var bScore = 0;
    var idx;
    for (idx = 0; idx < HEX_NUM; idx++) {
        // 评估位置分值
        if (stones[idx] === STONE.WHITE) {
            wScore += this._posVal[idx];
        } else if (stones[idx] === STONE.BLACK) {
            bScore += this._posVal[idx];
        }

        // 评估冲三的分值
        if (stones[idx] !== STONE.EMPTY) {
            if (this.check_dir_attack(idx, DIR.RIGHT)) {
                if (stones[idx] === STONE.WHITE) {
                    wScore += this._attackVal;
                } else {
                    bScore += this._attackVal;
                }
            }
            if (this.check_dir_attack(idx, DIR.LEFT_DOWN)) {
                if (stones[idx] === STONE.WHITE) {
                    wScore += this._attackVal;
                } else {
                    bScore += this._attackVal;
                }
            }
            if (this.check_dir_attack(idx, DIR.RIGHT_DOWN)) {
                if (stones[idx] === STONE.WHITE) {
                    wScore += this._attackVal;
                } else {
                    bScore += this._attackVal;
                }
            }
        }
    }
    console.log("WHITE SOCRE:" + wScore);
    console.log("BLACK SOCRE:" + bScore);
    if (this._ai._curSide == STONE.WHITE) {
        return wScore - bScore;
    } else {
        return bScore - wScore;
    }
};


