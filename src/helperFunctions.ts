import {
	checkForAvailableMoves,
	checkForCheck,
	moveManager,
	setData,
} from "./PieceMoves";
import { get, set } from "./variables";
let temp = false;
let threeFoldRept: any = [];
export async function getEval() {
	temp = true;
	let res = { eval: "", move: "" };

	await fetch("https://cengine.jpbhatt.tech/move", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ fen: getFEN() }),
	})
		.then((x) => x.json())
		.then((x) => {
			res = x;
		});
	while (JSON.stringify(res) == JSON.stringify({ eval: "", move: "" })) {
		await new Promise((r) => setTimeout(r, 10));
	}

	let move = res.move.split("\n");
	let ev: any = move[0].split(" ");
	let type = ev[ev.indexOf("score") + 1];
	let score: any = parseFloat(ev[ev.indexOf("score") + 2]) / 100;

	score = get.turn() ? score : -score;
	// if(type=="mate"){
	//     score=score>0?"1-0":"0-1";
	// }
	let bestMove = move[1].split(" ")[1];
	if (bestMove != "(none)") {
		set.curEvalMate(type == "mate");
		set.curEval(score);
	}
	set.engineDepth(move[0].split(" ")[2])
	let from = bestMove.charCodeAt(0) - 97 + parseInt(bestMove[1]) * 8 - 8;
	let pieceCode = get.board()[from];
	let piece: any =
		(pieceCode < "a" ? "1" : "0") +
		"prnbqk".indexOf(pieceCode.toLowerCase()) +
		get
			.pieceKeys()
			[
				"prnbqk".indexOf(pieceCode.toLowerCase()) +
					(pieceCode < "a" ? 6 : 0)
			].indexOf(from);
	piece = document.getElementById(piece);
	if (piece) {
		set.bestPiecePC(piece);
		piece.style.zIndex = 3;
	} else {
		set.bestPiecePC(null);
	}
	temp = false;
	set.thinking(false);
	set.bestMove(bestMove != "(none)" ? bestMove : "a1a1");
	if(!get.turn())
		performSuggestedMove()
	get.updater()((prev: any) => prev + 1);

}
export function getArrowPos(move: any) {
	let from = [move.charCodeAt(0) - 97, 7 - (move.charCodeAt(1) - 49)];
	let to = [move.charCodeAt(2) - 97, 7 - (move.charCodeAt(3) - 49)];
	let slope = (to[0] - from[0]) / (to[1] - from[1]);
	let type =
		from[1] == to[1]
			? 1
			: slope == 0
			? 0
			: slope == 1
			? 3
			: slope == -1
			? 2
			: Math.abs(slope) < 1
			? 5
			: 4;
	let dir = [
		from[0] < to[0] ? 1 : from[0] != to[0] ? -1 : 0,
		from[1] < to[1] ? 1 : from[1] != to[1] ? -1 : 0,
	];
	if (type != 4) to[0] = to[0] - dir[0] / 4;
	if (type != 5) to[1] = to[1] - dir[1] / 4;
	return [
		"M " +
			(from[0] * 80 + 30) +
			" " +
			(from[1] * 80 + 40) +
			" L " +
			(from[0] * 80 + 50) +
			" " +
			(from[1] * 80 + 40) +
			" L " +
			(to[0] * 80 + 50) +
			" " +
			(to[1] * 80 + 40) +
			" L " +
			(to[0] * 80 + 60) +
			" " +
			(to[1] * 80 + 40) +
			" L " +
			(to[0] * 80 + 40) +
			" " +
			(to[1] * 80 + 40 + 20 * dir[1]) +
			" L " +
			(to[0] * 80 + 20) +
			" " +
			(to[1] * 80 + 40) +
			" L " +
			(to[0] * 80 + 30) +
			" " +
			(to[1] * 80 + 40),
		"M " +
			(from[0] * 80 + 40) +
			" " +
			(from[1] * 80 + 30) +
			" L " +
			(from[0] * 80 + 40) +
			" " +
			(from[1] * 80 + 50) +
			" L " +
			(to[0] * 80 + 40) +
			" " +
			(to[1] * 80 + 50) +
			" L " +
			(to[0] * 80 + 40) +
			" " +
			(to[1] * 80 + 60) +
			" L " +
			(to[0] * 80 + 40 + 20 * dir[0]) +
			" " +
			(to[1] * 80 + 40) +
			" L " +
			(to[0] * 80 + 40) +
			" " +
			(to[1] * 80 + 20) +
			" L " +
			(to[0] * 80 + 40) +
			" " +
			(to[1] * 80 + 30),
		"M " +
			(from[0] * 80 + 33) +
			" " +
			(from[1] * 80 + 33) +
			" L " +
			(from[0] * 80 + 47) +
			" " +
			(from[1] * 80 + 47) +
			" L " +
			(to[0] * 80 + 47) +
			" " +
			(to[1] * 80 + 47) +
			" L " +
			(to[0] * 80 + 47 - dir[0] * dir[1] * 7) +
			" " +
			(to[1] * 80 + 47 - dir[0] * dir[1] * 7) +
			" L " +
			(to[0] * 80 + 40 + dir[0] * 13) +
			" " +
			(to[1] * 80 + 40 + dir[1] * 13) +
			" L " +
			(to[0] * 80 + 33 + dir[0] * dir[1] * 7) +
			" " +
			(to[1] * 80 + 33 + dir[0] * dir[1] * 7) +
			" L " +
			(to[0] * 80 + 33) +
			" " +
			(to[1] * 80 + 33),
		"M " +
			(from[0] * 80 + 33) +
			" " +
			(from[1] * 80 + 47) +
			" L " +
			(from[0] * 80 + 47) +
			" " +
			(from[1] * 80 + 33) +
			" L " +
			(to[0] * 80 + 47) +
			" " +
			(to[1] * 80 + 33) +
			" L " +
			(to[0] * 80 + 47 + dir[0] * dir[1] * 7) +
			" " +
			(to[1] * 80 + 33 - dir[0] * dir[1] * 7) +
			" L " +
			(to[0] * 80 + 40 + dir[0] * 13) +
			" " +
			(to[1] * 80 + 40 + dir[1] * 13) +
			" L " +
			(to[0] * 80 + 33 - dir[0] * dir[1] * 7) +
			" " +
			(to[1] * 80 + 47 + dir[0] * dir[1] * 7) +
			" L " +
			(to[0] * 80 + 33) +
			" " +
			(to[1] * 80 + 47),
		"M " +
			(from[0] * 80 + 40) +
			" " +
			(from[1] * 80 + 30) +
			" L " +
			(from[0] * 80 + 40) +
			" " +
			(from[1] * 80 + 50) +
			" L " +
			(to[0] * 80 + 40 + 10 * dir[0]) +
			" " +
			(from[1] * 80 + 50) +
			" L " +
			(to[0] * 80 + 40 + 10 * dir[0]) +
			" " +
			(from[1] * 80 + 30) +
			"M " +
			(to[0] * 80 + 30) +
			" " +
			(from[1] * 80 + 40 + 10 * dir[1]) +
			" L " +
			(to[0] * 80 + 50) +
			" " +
			(from[1] * 80 + 40 + 10 * dir[1]) +
			" L " +
			(to[0] * 80 + 50) +
			" " +
			(to[1] * 80 + 40) +
			" L " +
			(to[0] * 80 + 60) +
			" " +
			(to[1] * 80 + 40) +
			" L " +
			(to[0] * 80 + 40) +
			" " +
			(to[1] * 80 + 40 + 20 * dir[1]) +
			" L " +
			(to[0] * 80 + 20) +
			" " +
			(to[1] * 80 + 40) +
			" L " +
			(to[0] * 80 + 30) +
			" " +
			(to[1] * 80 + 40),
		"M " +
			(from[0] * 80 + 30) +
			" " +
			(from[1] * 80 + 40) +
			" L " +
			(from[0] * 80 + 50) +
			" " +
			(from[1] * 80 + 40) +
			" L " +
			(from[0] * 80 + 50) +
			" " +
			(to[1] * 80 + 40 + 10 * dir[1]) +
			" L " +
			(from[0] * 80 + 30) +
			" " +
			(to[1] * 80 + 40 + 10 * dir[1]) +
			"M " +
			(from[0] * 80 + 40 + 10 * dir[0]) +
			" " +
			(to[1] * 80 + 30) +
			" L " +
			(from[0] * 80 + 40 + 10 * dir[0]) +
			" " +
			(to[1] * 80 + 50) +
			" L " +
			(to[0] * 80 + 40) +
			" " +
			(to[1] * 80 + 50) +
			" L " +
			(to[0] * 80 + 40) +
			" " +
			(to[1] * 80 + 60) +
			" L " +
			(to[0] * 80 + 40 + 20 * dir[0]) +
			" " +
			(to[1] * 80 + 40) +
			" L " +
			(to[0] * 80 + 40) +
			" " +
			(to[1] * 80 + 20) +
			" L " +
			(to[0] * 80 + 40) +
			" " +
			(to[1] * 80 + 30),
	][type];
}
export function getFEN() {
	let board = get.board();
	let castling = get.castling();
	let enpassant = get.enpassant();
	let fiftyMove = get.fiftyMove();
	let moves = get.moves();
	let turn = get.turn();
	let boardCurSt: any = "00000000"
		.split("")
		.map((_, i) => board.slice(i * 8, (i + 1) * 8).split(""))
		.reverse()
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
					temp +=
						x[i] >= "a" ? x[i].toUpperCase() : x[i].toLowerCase();
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
	let turn = get.turn();
	let board = get.board();
	let x = (8 - (k % 8) - 4.5) * 9.375 + 4;
	let y = (Math.floor(k / 8) - 3.5) * 9.375 + 4;
	let move = get.bestMove();
	let from = move.charCodeAt(0) - 97 + parseInt(move[1]) * 8 - 8;
	if (move == "a1a1") from = -1;

	return {
		top: "calc(50vh - " + y + "vmin)",
		left: "calc(50vw - " + x + "vmin)",
		pointerEvents:
			(turn && board[k] >= "a") || (!turn && board[k] < "a")
				? "auto"
				: "none",
		transition: "top 0.2s left 0.2s",
		zIndex: k == from || temp ? 3 : 0,
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
export function checkForThreeFoldRept(board: any, threeFoldRept: any) {
	threeFoldRept = threeFoldRept.filter((x: any) => x == board);
	if (threeFoldRept.length >= 3) {
		return true;
	}
	return false;
}
export function checkForInsufficientMaterial(board: any) {
	let whiteBishopCount = 0;
	let blackBishopCount = 0;
	let whiteKnightCount = 0;
	let blackKnightCount = 0;
	let otherPieces = 0;
	board.split("").map((x: any) => {
		if (x == "b") whiteBishopCount++;
		else if (x == "B") blackBishopCount++;
		else if (x == "n") whiteKnightCount++;
		else if (x == "N") blackKnightCount++;
		else if (x != "-" && x != "k" && x != "K") otherPieces++;
	});
	if (otherPieces > 0) return false;
	else {
		if (
			whiteBishopCount + whiteKnightCount <= 1 &&
			blackBishopCount + blackKnightCount <= 1
		) {
			return true;
		} else if (
			whiteBishopCount == 0 &&
			blackBishopCount == 0 &&
			((whiteKnightCount == 2 && blackKnightCount == 0) ||
				(blackKnightCount == 2 && whiteKnightCount == 0))
		) {
			return true;
		}
		return false;
	}
}
export function promote(i: any, piece: any) {
	let vars = get.all();
	let temp = vars.board.split("");
	temp[(vars.turn ? 56 : 0) + vars.promotion] = piece;
	vars.board = temp.join("");
	vars.pieceKeys[(vars.turn ? 1 : 7) + i].push(
		(vars.turn ? 56 : 0) + vars.promotion
	);
	vars.pieceKeys[vars.turn ? 0 : 6] = vars.pieceKeys[vars.turn ? 0 : 6].map(
		(x: any) => (x == (vars.turn ? 56 : 0) + vars.promotion ? -1 : x)
	);
	vars.mvSq = new Array(64).fill(0);
	vars.promoting = false;
	vars.promotion = -1;
	vars.turn = !vars.turn;
	vars.check = checkForCheck(vars.board, vars.turn);
	vars.noMoveAvailable = checkForAvailableMoves(vars.board, vars.turn);
	vars.currentMove += "=" + piece.toUpperCase();
	if (vars.check && vars.noMoveAvailable) vars.currentMove += "#";
	else if (vars.check) vars.currentMove += "+";
	if (!vars.turn) vars.moveRecord.push([vars.currentMove]);
	else vars.moveRecord[vars.moveRecord.length - 1].push(vars.currentMove);
	threeFoldRept.push(vars.board);
	vars.insufficientMaterial = checkForInsufficientMaterial(vars.board);

	set.all(vars);
	getEval();
}
export function performSuggestedMove() {
	let move = get.bestMove();
	if (move == "a1a1"||temp) return;
	let sp = move.length > 4 && "rnbq".indexOf(move[4]) != -1 ? move[4] : null;

	let from = move.charCodeAt(0) - 97 + parseInt(move[1]) * 8 - 8;
	let to = move.charCodeAt(2) - 97 + parseInt(move[3]) * 8 - 8;
	let pieceCode = get.board()[from];
	let piece: any =
		(pieceCode < "a" ? "1" : "0") +
		"prnbqk".indexOf(pieceCode.toLowerCase()) +
		get
			.pieceKeys()
			[
				"prnbqk".indexOf(pieceCode.toLowerCase()) +
					(pieceCode < "a" ? 6 : 0)
			].indexOf(from);
	set.sel(from);
	set.mvSq(
		moveManager(from, get.board(), get.turn()) || new Array(64).fill(0)
	);
	
	moveTo(to, document.getElementById(piece));
	move = "a1a1";
	if (sp) {
		let i = "rnbq".indexOf(sp);
		promote(i, get.turn() ? sp : sp.toUpperCase());
	}
	move = "a1a1";
}
export function moveTo(i: any, piecex: any) {

	let vars: any = get.all();
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
	set.thinking(true);
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
	vars.promotion = -1;
	vars.promoting = false;
	vars.thinking = true;
	if ((piece == "P" && i < 8) || (piece == "p" && i > 55)) {
		vars.promoting = true;
		vars.promotion = i % 8;
	}
	if (vars.enpassant[0] != -1) {
		if (i == vars.enpassant[0] * 8 + vars.enpassant[1]) {
			captured =
				temp[
					(vars.enpassant[0] + (vars.turn ? -1 : 1)) * 8 +
						vars.enpassant[1]
				];
			temp[
				(vars.enpassant[0] + (vars.turn ? -1 : 1)) * 8 +
					vars.enpassant[1]
			] = "-";
			enp =
				(vars.enpassant[0] + (vars.turn ? -1 : 1)) * 8 +
				vars.enpassant[1];
		}
	}
	if (piece.toLowerCase() == "p" && captured != "-") {
		mv += fromRank;
	}
	if (captured != "-") {
		vars.capturedPieces += captured;
		mv += "x";
	}
	mv += toRank + "" + toFile;

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
	vars.currentHalfMove++;
	vars.currentMaxMoves++;
	vars.from = vars.sel;
	temp[i] = temp[vars.sel];
	temp[vars.sel] = "-";
	vars.board = temp.join("");
	vars.positionHistory[vars.positionHistory.length - 1][6] = piecex.id;
	vars.positionHistory.push([
		vars.pieceKeys,
		vars.fiftyMove,
		vars.enpassant,
		vars.castling,
		vars.turn,
		vars.board,
		piecex.id,
		vars.from,
		vars.to,
		vars.capturedPieces,
	]);
	if (!vars.promoting) {
		vars.check = checkForCheck(vars.board, vars.turn);
		vars.noMoveAvailable = checkForAvailableMoves(vars.board, vars.turn);
		if (vars.check && vars.noMoveAvailable == 0) mv += "#";
		else if (vars.check) mv += "+";
		if (!vars.turn) vars.moveRecord.push([mv]);
		else vars.moveRecord[vars.moveRecord.length - 1].push(mv);
		threeFoldRept.push(vars.board);
		vars.threeFoldReptition = checkForThreeFoldRept(
			vars.board,
			threeFoldRept
		);
		vars.insufficientMaterial = checkForInsufficientMaterial(vars.board);
	} else {
		vars.currentMove = mv;
	}
	setData(vars.enpassant, vars.castling);
	vars.pc = "-1";
	set.all(vars);
	if (!vars.promoting) getEval();
	setTimeout(() => {
		let mvr = document.getElementById("moveRecord");
		mvr?.scrollTo({
			top: mvr.scrollHeight,
			behavior: "smooth",
		});
	}, 0);
	return true;
}
