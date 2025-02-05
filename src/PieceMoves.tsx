const pieceDict: {
	[key: string]: (
		k: any,
		board: any,
		enemy: any,
		empty: any,
		turn: boolean,
		main: boolean
	) => any;
} = {
	p: pawnMoves,
	n: knightMoves,
	b: bishopMoves,
	r: rookMoves,
	q: queenMoves,
	k: kingMoves,
};
let check = false;
let enpassant = [-1, -1];
let castling = [true, true, true, true];
let fiftyMove = 0;
let moves = 0;
export function setData(
	chk: boolean,
	enp: number[],
	cast: boolean[],
	fif: number,
	mov: number
) {
	check = chk;
	enpassant = enp;
	castling = cast;
	fiftyMove = fif;
	moves = mov;
}
function deepCopy(arr: any) {
	return JSON.parse(JSON.stringify(arr));
}
function flatten(arr: any) {
	return arr.map((x: any) => x.join("")).join("");
}

export function moveManager(k: any, board: any, turn: boolean) {
	let piece = board[k];
	let pieceColor = piece >= "a";
	if (turn !== pieceColor) return;
	let boardMatrix = "00000000"
		.split("")
		.map((_, i) => board.slice(i * 8, (i + 1) * 8).split(""));
	let emptySpaces = boardMatrix.map((x) =>
		x.map((y: any) => (y == "-" ? true : false))
	);
	let enemyPieces = boardMatrix.map((x) =>
		x.map((y: any) =>
			(turn ? y.toUpperCase() : y.toLowerCase()) == y && y != "-"
				? true
				: false
		)
	);
	let pieceType = piece.toLowerCase();
	let pieceMoves = pieceDict[pieceType](
		k,
		boardMatrix,
		enemyPieces,
		emptySpaces,
		turn,
		true
	);
	let moves = "0"
		.repeat(64)
		.split("")
		.map((_, i) => (pieceMoves.includes(i) ? 1 : 0));
	return moves;
}

function pawnMoves(
	k: any,
	board: any,
	enemy: any,
	empty: any,
	turn: boolean,
	main: boolean
) {
	let temp = deepCopy(board);
	let tb = "-";
	let moves = [];
	let i = Math.floor(k / 8);
	let j = k % 8;
	let direction = turn ? 1 : -1;
	if (i + direction < 8 && empty[i + direction][j]) {
		tb = temp[i + direction][j];
		temp[i + direction][j] = temp[i][j];
		temp[i][j] = "-";
		if (!main || !checkForCheck(flatten(temp), turn)) {
			moves.push((i + direction) * 8 + j);
			// console.log("1",k)
			if (
				((i == 1 && direction == 1) || (i == 6 && direction == -1)) &&
				i + 2 * direction < 8 &&
				empty[i + 2 * direction][j]
			) {
				temp[i + 2 * direction][j] = temp[i + direction][j];
				temp[i + direction][j] = tb;
				if (!main || !checkForCheck(flatten(temp), turn))
					moves.push((i + 2 * direction) * 8 + j);
			}
		}
	}
	temp = deepCopy(board);

	if (
		j + 1 < 8 &&
		i + direction < 8 &&
		(enemy[i + direction][j + 1] ||
			(enpassant[0] == i + direction && enpassant[1] == j + 1&&enemy[i][j+1]))
	) {
		temp[i + direction][j + 1] = temp[i][j];
		temp[i][j] = "-";
		if (!main || !checkForCheck(flatten(temp), turn))
			moves.push((i + direction) * 8 + j + 1);
	}
	temp = deepCopy(board);
	if (
		j - 1 >= 0 &&
		i + direction < 8 &&
		(enemy[i + direction][j - 1] ||
			(enpassant[0] == i + direction && enpassant[1] == j - 1&&enemy[i][j-1]))
	) {
		temp[i + direction][j - 1] = temp[i][j];
		temp[i][j] = "-";
		if (!main || !checkForCheck(flatten(temp), turn))
			moves.push((i + direction) * 8 + j - 1);
	}
	return moves;
}
function knightMoves(
	k: any,
	board: any,
	enemy: any,
	empty: any,
	turn: boolean,
	main: boolean
) {
	let moveable = enemy.map((x: any, i: any) =>
		x.map((y: any, j: any) => y || empty[i][j])
	);
	let moves = [];
	let i = Math.floor(k / 8);
	let j = k % 8;
	let directions = [
		[1, 2],
		[2, 1],
		[1, -2],
		[2, -1],
		[-1, 2],
		[-2, 1],
		[-1, -2],
		[-2, -1],
	];
	let temp = deepCopy(board);
	let tb = "-";
	for (let x of directions) {
		let i2 = i + x[0];
		let j2 = j + x[1];
		if (i2 >= 0 && i2 < 8 && j2 >= 0 && j2 < 8 && moveable[i2][j2]) {
			tb = temp[i2][j2];
			temp[i2][j2] = temp[i][j];
			temp[i][j] = "-";
			if (!main || !checkForCheck(flatten(temp), turn))
				moves.push(i2 * 8 + j2);
			temp[i][j] = temp[i2][j2];
			temp[i2][j2] = tb;
		}
	}
	return moves;
}
function bishopMoves(
	k: any,
	board: any,
	enemy: any,
	empty: any,
	turn: boolean,
	main: boolean
) {
	let moves = [];
	let moveable = enemy.map((x: any, i: any) =>
		x.map((y: any, j: any) => y || empty[i][j])
	);
	let i = Math.floor(k / 8);
	let j = k % 8;
	let directions = [
		[1, 1],
		[1, -1],
		[-1, 1],
		[-1, -1],
	];
	let temp = deepCopy(board);
	let tb = "-";
	for (let x of directions) {
		let i2 = i + x[0];
		let j2 = j + x[1];
		while (i2 >= 0 && i2 < 8 && j2 >= 0 && j2 < 8 && moveable[i2][j2]) {
			tb = temp[i2][j2];
			temp[i2][j2] = temp[i][j];
			temp[i][j] = "-";
			if (!main || !checkForCheck(flatten(temp), turn))
				moves.push(i2 * 8 + j2);
			temp[i][j] = temp[i2][j2];
			temp[i2][j2] = tb;
			if (!empty[i2][j2]) break;
			i2 += x[0];
			j2 += x[1];
		}
	}
	return moves;
}
function rookMoves(
	k: any,
	board: any,
	enemy: any,
	empty: any,
	turn: boolean,
	main: boolean
) {
	let moves = [];
	let moveable = enemy.map((x: any, i: any) =>
		x.map((y: any, j: any) => y || empty[i][j])
	);
	let i = Math.floor(k / 8);
	let j = k % 8;
	let directions = [
		[1, 0],
		[0, -1],
		[-1, 0],
		[0, 1],
	];
	let temp = deepCopy(board);
	let tb = "-";
	for (let x of directions) {
		let i2 = i + x[0];
		let j2 = j + x[1];
		while (i2 >= 0 && i2 < 8 && j2 >= 0 && j2 < 8 && moveable[i2][j2]) {
			tb = temp[i2][j2];
			temp[i2][j2] = temp[i][j];
			temp[i][j] = "-";
			if (!main || !checkForCheck(flatten(temp), turn))
				moves.push(i2 * 8 + j2);
			temp[i][j] = temp[i2][j2];
			temp[i2][j2] = tb;
			if (!empty[i2][j2]) break;
			i2 += x[0];
			j2 += x[1];
		}
	}
	return moves;
}
function queenMoves(
	k: any,
	board: any,
	enemy: any,
	empty: any,
	turn: boolean,
	main: boolean
) {
	let moves = bishopMoves(k, board, enemy, empty, turn, main).concat(
		rookMoves(k, board, enemy, empty, turn, main)
	);
	return moves;
}
function kingMoves(
	k: any,
	board: any,
	enemy: any,
	empty: any,
	turn: boolean,
	main: boolean
) {
	let moves = [];
	let moveable = enemy.map((x: any, i: any) =>
		x.map((y: any, j: any) => y || empty[i][j])
	);
	let i = Math.floor(k / 8);
	let j = k % 8;
	let directions = [
		[1, 0],
		[0, -1],
		[-1, 0],
		[0, 1],
		[1, 1],
		[1, -1],
		[-1, 1],
		[-1, -1],
	];
	let temp = deepCopy(board);
	let tb = "-";
	for (let x of directions) {
		let i2 = i + x[0];
		let j2 = j + x[1];
		if (i2 >= 0 && i2 < 8 && j2 >= 0 && j2 < 8 && moveable[i2][j2]) {
			tb = temp[i2][j2];
			temp[i2][j2] = temp[i][j];
			temp[i][j] = "-";
			if (!main || !checkForCheck(flatten(temp), turn))
				moves.push(i2 * 8 + j2);
			temp[i][j] = temp[i2][j2];
			temp[i2][j2] = tb;
		}
	}

	if (
		castling[turn ? 1 : 3] &&
		empty[i][j + 1] &&
		empty[i][j + 2] &&
		board[i][j + 3].toLowerCase() == "r"
		&& moves.indexOf(i * 8 + j + 1) != -1
	) {	
		
		tb = temp[i][j + 2];
		temp[i][j + 2] = temp[i][j];
		temp[i][j] = "-";
		if (!main || !checkForCheck(flatten(temp), turn)) {
			moves.push(i * 8 + j + 2);
		}
		temp[i][j] = temp[i][j + 2];
		temp[i][j + 2] = tb;
	}

	if (castling[turn ? 0 : 2]) {
		if (
			empty[i][j - 1] &&
			empty[i][j - 2] &&
			empty[i][j - 3] &&
			board[i][j - 4].toLowerCase() == "r"
			&& moves.indexOf(i * 8 + j - 1) != -1
		) {
			tb = temp[i][j - 3];
			temp[i][j - 3] = temp[i][j];
			temp[i][j] = "-";
			if (!main || !checkForCheck(flatten(temp), turn)) {
				moves.push(i * 8 + j - 2);
			}
			temp[i][j] = temp[i][j - 3];
			temp[i][j - 3] = tb;
		}
	}
	return moves;
}
export function checkForAvailableMoves(board: any, turn: boolean) {
	let boardMatrix = "00000000"
		.split("")
		.map((_, i) => board.slice(i * 8, (i + 1) * 8).split(""));
	let emptySpaces = boardMatrix.map((x) =>
		x.map((y: any) => (y == "-" ? true : false))
	);
	let myPieces = boardMatrix.map((x) =>
		x.map((y: any) =>
			(turn ? y.toLowerCase() : y.toUpperCase()) == y && y != "-"
				? true
				: false
		)
	);
	let enemyPieces = boardMatrix.map((x) =>
		x.map((y: any) =>
			(turn ? y.toUpperCase() : y.toLowerCase()) == y && y != "-"
				? true
				: false
		)
	);
	let moveCount = 0;
	for (let i = 0; i < 64; i++) {
		let mv=[]
		if (board[i] == "-") continue;
		if (turn && board[i] >= "a") {
			mv= pieceDict[board[i].toLowerCase()](
				i,
				boardMatrix,
				enemyPieces,
				emptySpaces,
				turn,
				true
			);
			moveCount += mv.length;
		} else if (!turn && board[i] < "a") {
			mv = pieceDict[board[i].toLowerCase()](
				i,
				boardMatrix,
				enemyPieces,
				emptySpaces,
				turn,
				true
			)
			moveCount += mv.length;
		}
		if (moveCount > 0) {
			console.log(mv,i,board[i])
			break
		}
	}
	return moveCount;
}

export function checkForCheck(board: any, turn: boolean) {
	let boardMatrix = "00000000"
		.split("")
		.map((_, i) => board.slice(i * 8, (i + 1) * 8).split(""));
	let emptySpaces = boardMatrix.map((x) =>
		x.map((y: any) => (y == "-" ? true : false))
	);
	let myPieces = boardMatrix.map((x) =>
		x.map((y: any) =>
			(turn ? y.toLowerCase() : y.toUpperCase()) == y && y != "-"
				? true
				: false
		)
	);
	let kingIndex = board.indexOf(turn ? "k" : "K");
	let check = false;
	for (let i = 0; i < 64 && !check; i++) {
		if (board[i] == "-") continue;
		else if (turn && board[i] < "a") {
			check = pieceDict[board[i].toLowerCase()](
				i,
				boardMatrix,
				myPieces,
				emptySpaces,
				!turn,
				false
			).includes(kingIndex);
		} else if (!turn && board[i] >= "a") {
			check = pieceDict[board[i].toLowerCase()](
				i,
				boardMatrix,
				myPieces,
				emptySpaces,
				!turn,
				false
			).includes(kingIndex);
		}
	}
	return check;
}
