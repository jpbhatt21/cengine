import { checkForAvailableMoves, checkForCheck, moveManager, setData } from "./PieceMoves";
import { get, set } from "./variables";

export function getFEN(){

    let board=get.board();
    let castling=get.castling();
    let enpassant=get.enpassant();
    let fiftyMove=get.fiftyMove();
    let moves=get.moves();
    let turn=get.turn();
    let boardCurSt: any = "00000000"
        .split("")
        .map((_, i) => board.slice(i * 8, (i + 1) * 8).split("")).reverse()
        .map((x: any) => {
            let count = 0;
            let temp = "";
            for (let i = 0; i < 8; i++) {
                if (x[i] == "-") {
                    count++;
                } else {
                    if (count > 0) {
                        temp += count.toString();
                        count = 0;
                    }
                    temp += x[i]>="a"?x[i].toUpperCase():x[i].toLowerCase();
                }
            }
            if (count > 0) {
                temp += count.toString();
            }
            return temp;
        })
        .join("/");
    let cst =
        "" +
        (castling[1] ? "K" : "") +
        (castling[0] ? "Q" : "") +
        (castling[3] ? "k" : "") +
        (castling[2] ? "q" : "");
    cst = cst == "" ? "-" : cst;
    let fen =
        boardCurSt +
        " " +
        (turn ? "w" : "b") +
        " " +
        cst +
        " " +
        (enpassant[0] != -1
            ? "abcdefgh"[enpassant[1]] + "" + (enpassant[0] + 1)
            : "-") +
        " " +
        fiftyMove +
        " " +
        moves;
    return fen;

}
export function normalize(x: number, y: number, str: string) {
    str = str
        .split(" ")
        .map((z, i) => parseInt(z) + (i % 2 == 0 ? x : y))
        .join(" ");
    return str;
}
export function boardPositionToGlobalPosition(k: number) {
    let turn=get.turn();
    let board=get.board();
	let x = (8 - (k % 8) - 4.5) * 9.375 + 4;
	let y = (Math.floor(k / 8) - 3.5) * 9.375 + 4;

	return {
		top: "calc(50vh - " + y + "vmin)",
		left: "calc(50vw - " + x + "vmin)",
		pointerEvents:
			(turn && board[k] >= "a") || (!turn && board[k] < "a")
				? "auto"
				: "none",transitionDuration : "0.2s"
	};
}
export function clearPieces(def: boolean = true) {
    let allPieces = document.getElementById("allPieces")?.children;
    for (let j = 0; allPieces && j < allPieces?.length; j++) {
        if (allPieces[j].firstChild) {
            (allPieces[j].firstChild as HTMLElement).style.transitionDuration =
                def ? "0s" : "0.2s";
        }
    }
    set.clearAllTD(null);
}
export function moveTo(i: any, piecex: any) {
    let vars:any=get.all()
    if (vars.promoting) return false;
    if (i < 0 || i > 63) return false;
    if (vars.mvSq[i] == 0) return false;
    piecex.style.transitionDuration = "0.2s";
    let mv = "";
    clearPieces(false);
    if (vars.clearAllTD) {
        clearTimeout(vars.clearAllTD);
        vars.clearAllTD = null;
    } else
    vars.clearAllTD = setTimeout(() => {
            clearPieces();
        }, 500);
    let enp = -1;
    let temp = vars.board.split("");
    let piece = vars.board[vars.sel];
    let cast = NaN;
    let fromFile = Math.floor(vars.sel / 8) + 1;
    let toFile = Math.floor(i / 8) + 1;
    let fromRank = "abcdefgh"[vars.sel % 8];
    let toRank = "abcdefgh"[i % 8];
    let pieceType = piece.toLowerCase();
    let captured = vars.board[i];
    if (pieceType != "p") {
        mv += pieceType.toUpperCase();
        if (pieceType != "k") {
            let samePieces = vars.pieceKeys[
                (vars.turn ? 1 : 7) + "rnbq".indexOf(pieceType)
            ].filter((x: any) => x != vars.sel);
            for (let j = 0; j < samePieces.length; j++) {
                let moves = moveManager(samePieces[j], vars.board, vars.turn);

                if (moves && moves[i] == 1) {
                    if (samePieces[j] % 8 != vars.sel % 8) {
                        mv += fromRank;
                    } else {
                        mv += fromFile.toString();
                    }
                    break;
                }
            }
        }
    }
    if (piece.toLowerCase() == "p" && captured != "-") {
        mv += fromRank;
    }
    if (captured != "-") {
        mv += "x";
    }
    mv += toRank + "" + toFile;

    vars.promotion = -1;
    vars.promoting = false;
    if ((piece == "P" && i < 8) || (piece == "p" && i > 55)) {
        vars.promoting = true;
        vars.promotion = i % 8;
    }
    if (vars.enpassant[0] != -1) {
        if (i == vars.enpassant[0] * 8 + vars.enpassant[1]) {
            temp[(vars.enpassant[0] + (vars.turn ? -1 : 1)) * 8 + vars.enpassant[1]] = "-";
            enp = (vars.enpassant[0] + (vars.turn ? -1 : 1)) * 8 + vars.enpassant[1];
        }
    }
    if (piece.toLowerCase() == "k" && Math.abs(vars.sel - i) == 2) {
        if (i % 8 == 6) {
            temp[i + 1] = "-";
            temp[i - 1] = vars.turn ? "r" : "R";
            mv = "O-O";
            cast = i + 1;
        }
        if (i % 8 == 2) {
            temp[i - 2] = "-";
            temp[i + 1] = vars.turn ? "r" : "R";
            mv = "O-O-O";
            cast = i - 2;
        }
    }
    if (piece.toLowerCase() == "r") {
        if (vars.sel == vars.pieceKeys[vars.turn ? 1 : 7][0]) {
            vars.castling[vars.turn ? 0 : 2] = false;
        }
        if (vars.sel == vars.pieceKeys[vars.turn ? 1 : 7][1]) {
            vars.castling[vars.turn ? 1 : 3] = false;
        }
    }

    vars.pieceKeys = vars.pieceKeys.map((x: any) => {
        return x.map((y: any) =>
            y == i || y == enp
                ? -1
                : y == vars.sel
                ? i
                : y == cast
                ? [y + 3, y - 2][y % 2]
                : y
        );
    });
    vars.mvSq = new Array(64).fill(0);
    if (!vars.turn) {
        vars.moves++;
    }
    if (!vars.promoting) vars.turn = !vars.turn;

    vars.enpassant = [-1, -1];

    if (piece.toLowerCase() == "p") {
        if (Math.abs(vars.sel - i) == 16)
            vars.enpassant = [Math.floor(i / 8) + (vars.turn ? 1 : -1), i % 8];
        vars.fiftyMove = 0;
    } else if (vars.board[i] == "-") {
        vars.fiftyMove++;
    } else {
        vars.fiftyMove = 0;
    }
    if (piece.toLowerCase() == "k") {
        vars.castling[0 + (vars.turn ? 2 : 0)] = false;
        vars.castling[1 + (vars.turn ? 2 : 0)] = false;
    }
    vars.to = i;
    vars.from = vars.sel;
    temp[i] = temp[vars.sel];
    temp[vars.sel] = "-";
    vars.board = temp.join("");

    if (!vars.promoting) {
        vars.check = checkForCheck(vars.board, vars.turn);
        vars.moveCount = checkForAvailableMoves(vars.board, vars.turn);
        if (vars.check && vars.moveCount == 0) mv += "#";
        else if (vars.check) mv += "+";
        if (!vars.turn) vars.moveRecord.push([mv]);
        else vars.moveRecord[vars.moveRecord.length - 1].push(mv);
    } else {
        vars.currentMove = mv;
    }
    setData( vars.enpassant, vars.castling);
    vars.pc = "-1";
    set.all(vars);
    setTimeout(() => {let mvr=document.getElementById("moveRecord");
        mvr?.scrollTo({
            top: mvr.scrollHeight,
            behavior: "smooth",
        });}, 0);
    return true;
}