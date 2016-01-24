"use strict";

function Eval(ai) {
    this._ai = ai;
    this._posVal = [
        1, 1, 1, 1, 1, 0, 0, 0, 0,
        1, 2, 2, 2, 2, 1, 0, 0, 0,
        1, 2, 9, 9, 9, 2, 1, 0, 0,
        1, 2, 9, 16, 16, 9, 2, 1, 0,
        1, 2, 9, 16, 25, 16, 9, 2, 1,
        0, 1, 2, 9, 16, 16, 9, 2, 1,
        0, 0, 1, 2, 9, 9, 9, 2, 1,
        0, 0, 0, 1, 2, 2, 2, 2, 1,
        0, 0, 0, 0, 1, 1, 1, 1, 1
    ];
    this._attackVal = 500;

    this._twoVal = 50;          // oo 连二的分值
    this._twoShortVal = 60;     // oxo 短二的分值
    this._twoLongVal = 70;      // oxxo 长二的分值

    this._triangleVal = 100;    // 形成三角形的分值
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

Eval.prototype.check_two = function (idx, dir) {
    var result = [0, 0, 0];
    var stones = this._ai._stones;
    var mask = this._ai._mask;
    var side = stones[idx];
    if (idx + dir < HEX_NUM && mask[idx + dir] !== 0) {
        // 判断 oo
        if (stones[idx + dir] === side) {
            result[0] = 1;
        } else if (stones[idx + dir] === STONE.EMPTY) {
            if (idx + dir * 2 < HEX_NUM && mask[idx + dir * 2] !== 0) {
                // 判断 oxo
                if (stones[idx + dir * 2] === side) {
                    result[1] = 1;
                } else if (stones[idx + dir * 2] === STONE.EMPTY) {
                    if (idx + dir * 3 < HEX_NUM && mask[idx + dir * 3] !== 0) {
                        // 判断oxxo
                        if (stones[idx + dir * 3] === side) {
                            result[2] = 1;
                        }
                    }
                }
            }
        }
    }
    return result;
};

Eval.prototype.eval_board = function () {
    var stones = this._ai._stones;
    var wScore = 0;
    var bScore = 0;
    var idx;
    var r, rd, ld;  // 保存在三个方向上的成二的检测结果(右\右下\左下)
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

        // 评估成二的分值
        if (stones[idx] != STONE.EMPTY) {
            r = this.check_two(idx, DIR.RIGHT);
            ld = this.check_two(idx, DIR.LEFT_DOWN);
            rd = this.check_two(idx, DIR.RIGHT_DOWN);
            var val = 0;
            for (var i = 0; i < 3; i++) {
                switch (i) {
                    case 0:
                        val = this._twoVal;
                        break;
                    case 1:
                        val = this._twoShortVal;
                        break;
                    case 2:
                        val = this._twoLongVal;
                        break;
                }
                if (r[i] === 1) {
                    if (stones[idx] === STONE.WHITE) {
                        wScore += val;
                    } else {
                        bScore += val;
                    }
                }
                if (ld[i] === 1) {
                    if (stones[idx] === STONE.WHITE) {
                        wScore += val;
                    } else {
                        bScore += val;
                    }
                }
                if (rd[i] === 1) {
                    if (stones[idx] === STONE.WHITE) {
                        wScore += val;
                    } else {
                        bScore += val;
                    }
                }

                // 检测三角形
                if(ld[i] === 1 && rd[i] === 1) {
                    var ldIdx = idx + DIR.LEFT_DOWN * (i + 1);
                    var rTmp = this.check_two(ldIdx, DIR.RIGHT);
                    if(rTmp[i] === 1) {
                        if (stones[idx] === STONE.WHITE) {
                            wScore += this._triangleVal;
                        } else {
                            bScore += this._triangleVal;
                        }
                    }
                }
                if(rd[i] === 1 && r[i] === 1) {
                    var rIdx = idx + DIR.RIGHT * (i + 1);
                    var ldTmp = this.check_two(rIdx, DIR.LEFT_DOWN);
                    if(ldTmp[i] === 1) {
                        if (stones[idx] === STONE.WHITE) {
                            wScore += this._triangleVal;
                        } else {
                            bScore += this._triangleVal;
                        }
                    }
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


