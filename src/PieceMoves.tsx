const blank = "0".repeat(64).split("");
export const whitePawnMoves=Array.from("0".repeat(56)).map((_,i:any)=>(BigInt(0x100)*BigInt(Math.pow(2,i)))).concat(Array.from("0".repeat(8)).map((_,i:any)=>(BigInt(0x0))));
export const whiteCaptures=Array.from("0".repeat(56)).map((_,i:any)=>(BigInt([
    0x200,0x500,0xa00,0x1400,0x2800,0x5000,0xa000,0x4000
][i%8])*BigInt(Math.pow(256,Math.floor(i/8))))).concat(Array.from("0".repeat(8)).map((_,i:any)=>(BigInt(0x0))))
export const blackPawnMoves=(Array.from("0".repeat(8)).map((_,i:any)=>(BigInt(0x0)))).concat(Array.from("0".repeat(56)).map((_,i:any)=>(BigInt(0x1)*BigInt(Math.pow(2,i)))));
export const blackCaptures=(Array.from("0".repeat(8)).map((_,i:any)=>(BigInt(0x0)))).concat(Array.from("0".repeat(56)).map((_,i:any)=>(BigInt([
    0b10,0b101,0b1010,0b10100,0b101000,0b1010000,0b10100000,0b1000000
][i%8])*BigInt(Math.pow(256,Math.floor(i/8))))))
console.log(blackPawnMoves[56]);
let board = [
	blank
		.map((x: any, i) => {
			return Math.floor(i / 8) == 1 ? "1" : "0";
		})
		.join(""),
	blank
		.map((x: any, i) => {
			return Math.floor(i / 8) == 0 && (i % 8 == 0 || i % 8 == 7)
				? "1"
				: "0";
		})
		.join(""),
	blank
		.map((x: any, i) => {
			return Math.floor(i / 8) == 0 && (i % 8 == 1 || i % 8 == 6)
				? "1"
				: "0";
		})
		.join(""),
	blank
		.map((x: any, i) => {
			return Math.floor(i / 8) == 0 && (i % 8 == 2 || i % 8 == 5)
				? "1"
				: "0";
		})
		.join(""),
	blank
		.map((x: any, i) => {
			return Math.floor(i / 8) == 0 && i % 8 == 3 ? "1" : "0";
		})
		.join(""),
	blank
		.map((x: any, i) => {
			return Math.floor(i / 8) == 0 && i % 8 == 4 ? "1" : "0";
		})
		.join(""),
	blank
		.map((x: any, i) => {
			return Math.floor(i / 8) == 6 ? "1" : "0";
		})
		.join(""),
	blank
		.map((x: any, i) => {
			return Math.floor(i / 8) == 7 && (i % 8 == 0 || i % 8 == 7)
				? "1"
				: "0";
		})
		.join(""),
	blank
		.map((x: any, i) => {
			return Math.floor(i / 8) == 7 && (i % 8 == 1 || i % 8 == 6)
				? "1"
				: "0";
		})
		.join(""),
	blank
		.map((x: any, i) => {
			return Math.floor(i / 8) == 7 && (i % 8 == 2 || i % 8 == 5)
				? "1"
				: "0";
		})
		.join(""),
	blank
		.map((x: any, i) => {
			return Math.floor(i / 8) == 7 && i % 8 == 3 ? "1" : "0";
		})
		.join(""),
	blank
		.map((x: any, i) => {
			return Math.floor(i / 8) == 7 && i % 8 == 4 ? "1" : "0";
		})
		.join(""),
].map((x)=>BigInt("0b"+x));
// console.log(BigInt("0b"+board[0]).toString(2));
console.log(whitePawnMoves[0],whitePawnMoves[0]<<BigInt(32)    )
let fullBoard = BigInt(0)
board.forEach((x) => {
  fullBoard = fullBoard | x;
});
export const pawnMoves = (piece:any, board:any,fullboard:any,turn:Boolean) => {
let x = piece%8;
let y = Math.floor(piece/8);
let delta = turn?1:-1;
let moves =turn? [
    whitePawnMoves[piece],
    whiteCaptures[piece]
] : [
    blackPawnMoves[piece],
    blackCaptures[piece]]
    ;
moves[0] = (BigInt(moves[0]) & BigInt(fullboard))>BigInt(0)?BigInt(0):BigInt(moves[0]);
if(y==1&&moves[0]>BigInt(0)&&turn){
    moves[0] = moves[0] | ((BigInt(whitePawnMoves[piece+8]) & BigInt(fullboard))>BigInt(0)?BigInt(0):BigInt(whitePawnMoves[piece+8]));
}
else if(y==6&&moves[0]>BigInt(0)&&!turn){
    moves[0] = moves[0] | ((BigInt(blackPawnMoves[piece-8]) & BigInt(fullboard))>BigInt(0)?BigInt(0):BigInt(blackPawnMoves[piece-8]));
}


return(("0".repeat(64-moves[0].toString(2).length)+moves[0].toString(2)).split(""));
};
pawnMoves(54,board,fullBoard,true);