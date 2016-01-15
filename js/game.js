"use strict";

function Game() {
    this._ui = new UI(this);
    this._board = new Board();
    this._curSide = EMPTY;
    this._lastIdx = -1;
}

Game.prototype.restart = function () {
    this._board.reset();
    this._curSide = WHITE;
    this._lastIdx = -1;
};

Game.prototype.loadYpn = function (ypn) {
    var ypnArray = ypn.split(" ");
    var ypnStr = ypnArray[0];
    var side = ypnArray[1];
    this.restart();
    if(side == "w") {
        this._curSide = WHITE;
    } else if(side == "b") {
        this._curSide = BLACK;
    }
    ypnArray = ypnStr.split("/");
    for(var i = 0; i < ypnArray.length; i++) {

    }
    this._ui.update();
};

Game.prototype.changSide = function () {
    this._curSide ^= 3;
};

Game.prototype.onCellClick = function (idx) {
    var m = MOVE(this._curSide, idx);
    this._board.makeMove(m);
    this._lastIdx = idx;
    this.changSide();
    this._ui.update();
};


//function parseYpn(ypn) {
//    resetBoard();
//
//    var row = 0;
//    var column = 0;
//    var index = 0;
//    var stone;
//
//    while (row <= 9 && index < ypn.length) {
//        switch (ypn[index]) {
//            case "w":
//                stone = SIDE.WHITE;
//                if (row == 9) {
//                    brd_curSide = stone;
//                } else {
//                    brd_stones[HEX_TO_121[row * 9 + column]] = stone;
//                    column++;
//                }
//                break;
//            case "b":
//                stone = SIDE.BLACK;
//                if (row == 9) {
//                    brd_curSide = stone;
//                } else {
//                    brd_stones[HEX_TO_121[row * 9 + column]] = stone;
//                    column++;
//                }
//                break;
//            case "1":
//            case "2":
//            case "3":
//            case "4":
//            case "5":
//            case "6":
//            case "7":
//            case "8":
//            case "9":
//                column += parseInt(ypn[index]);
//                break;
//            case "/":
//            case " ":
//                row++;
//                if (row < 5) {
//                    column = 0;
//                } else {
//                    column = row - 4;
//                }
//                break;
//            default:
//                console.log("Load ypn error at index " + index);
//                return;
//        }
//        index++;
//    }
//
//    brd_positionKey = CreatePositionKey();
//}
//
//function boardToYpn() {
//    var ypn = "";
//    var index;
//    var emptyCount;
//    var stone;
//    for (var i = 0; i < 9; i++) {
//        emptyCount = 0;
//        for (var j = 0; j < 9; j++) {
//            index = HEX_TO_121[i * 9 + j];
//            if (HEXES[index] == POS.INBOARD) {
//                stone = brd_stones[index];
//                if (stone == SIDE.NONE) {
//                    emptyCount++;
//                } else {
//                    if (emptyCount > 0) {
//                        ypn += emptyCount.toString();
//                    }
//                    ypn += (stone == SIDE.WHITE ? "w" : "b");
//                    emptyCount = 0;
//                }
//            }
//        }
//        if (emptyCount > 0) {
//            ypn += emptyCount.toString();
//        }
//        if (i < 8) {
//            ypn += "/";
//        }
//    }
//    ypn += " " + (brd_curSide == SIDE.WHITE ? "w" : "b");
//    return ypn;
//}