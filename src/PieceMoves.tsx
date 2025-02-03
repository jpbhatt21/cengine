const pieceDict: { [key: string]: (k: any, board: any,enemy:any,empty:any, turn: boolean) => any } = {
	p:pawnMoves,n:knightMoves,
};
export function moveManager(k:any,board:any,turn:boolean){
	let piece = board[k]
	let pieceColor = piece<"a"
	if(turn !== pieceColor)
		return
	let boardMatrix = "00000000".split("").map((_,i)=>board.slice(i*8,(i+1)*8).split(""))
	let emptySpaces = boardMatrix.map((x)=>x.map((y:any)=>y=="-"?true:false))
	let enemyPieces = boardMatrix.map((x)=>x.map((y:any)=>((turn?y.toLowerCase():y.toUpperCase())==y) && y!= "-"?true:false))
	let pieceType = piece.toLowerCase();
	let pieceMoves = pieceDict[pieceType](k, boardMatrix,enemyPieces,emptySpaces, turn);
	let moves=("0").repeat(64).split("").map((_,i)=>pieceMoves.includes(i)?1:0)
	return moves
	


}

function pawnMoves(k: any, board: any,enemy:any,empty:any, turn: boolean) {
	let moves=[]
	let i = Math.floor(k/8)
	let j = k%8
	let direction = turn?1:-1
	if(i+direction<8 && empty[i+direction][j]){
		moves.push((i+direction)*8+j)
		if((i==1 && direction==1) || (i==6 && direction==-1) && empty[i+2*direction][j])
			moves.push((i+2*direction)*8+j)
	}
	if(j+1<8 && i+direction<8 && enemy[i+direction][j+1])
		moves.push((i+direction)*8+j+1)
	
	if(j-1>=0 && i+direction<8 && enemy[i+direction][j-1])
		moves.push((i+direction)*8+j-1)
	return moves
	
}
function knightMoves(k: any, board: any,enemy:any,empty:any, turn: boolean) {
	console.log("called")
	let moves=[]
	let i = Math.floor(k/8)
	let j = k%8
	let directions = [[1,2],[2,1],[1,-2],[2,-1],[-1,2],[-2,1],[-1,-2],[-2,-1]]
	for(let x of directions){
		let i2 = i+x[0]
		let j2 = j+x[1]
		if(i2>=0 && i2<8 && j2>=0 && j2<8 && (empty[i2][j2] || enemy[i2][j2]))
			moves.push(i2*8+j2)
	}
	return moves
}