const pieceDict: { [key: string]: (k: any, board: any,enemy:any,empty:any, turn: boolean) => any } = {
	p:pawnMoves,n:knightMoves,b:bishopMoves,r:rookMoves,q:queenMoves,k:kingMoves
};
export function moveManager(k:any,board:any,turn:boolean){
	checkForCheck(board,turn)
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
	let moveable=enemy.map((x:any,i:any)=>x.map((y:any,j:any)=>y||empty[i][j]))
	let moves=[]
	let i = Math.floor(k/8)
	let j = k%8
	let directions = [[1,2],[2,1],[1,-2],[2,-1],[-1,2],[-2,1],[-1,-2],[-2,-1]]
	for(let x of directions){
		let i2 = i+x[0]
		let j2 = j+x[1]
		if(i2>=0 && i2<8 && j2>=0 && j2<8 && moveable[i2][j2])
			moves.push(i2*8+j2)
	}
	return moves
}
function bishopMoves(k: any, board: any,enemy:any,empty:any, turn: boolean) {
	let moves=[]
	let moveable=enemy.map((x:any,i:any)=>x.map((y:any,j:any)=>y||empty[i][j]))
	let i = Math.floor(k/8)
	let j = k%8
	let directions = [[1,1],[1,-1],[-1,1],[-1,-1]]
	for(let x of directions){
		let i2 = i+x[0]
		let j2 = j+x[1]
		while(i2>=0 && i2<8 && j2>=0 && j2<8 && moveable[i2][j2]){
			moves.push(i2*8+j2)
			if(!empty[i2][j2])
				break
			i2+=x[0]
			j2+=x[1]
			
		}
	}
	return moves
	
}
function rookMoves(k: any, board: any,enemy:any,empty:any, turn: boolean) {
	let moves=[]
	let moveable=enemy.map((x:any,i:any)=>x.map((y:any,j:any)=>y||empty[i][j]))
	let i = Math.floor(k/8)
	let j = k%8
	let directions = [[1,0],[0,-1],[-1,0],[0,1]]
	for(let x of directions){
		let i2 = i+x[0]
		let j2 = j+x[1]
		while(i2>=0 && i2<8 && j2>=0 && j2<8 && moveable[i2][j2]){
			moves.push(i2*8+j2)
			if(!empty[i2][j2])
				break
			i2+=x[0]
			j2+=x[1]
			
		}
	}
	return moves
	
}
function queenMoves(k: any, board: any,enemy:any,empty:any, turn: boolean) {
	let moves=bishopMoves(k,board,enemy,empty,turn).concat(rookMoves(k,board,enemy,empty,turn))
	return moves
}
function kingMoves(k: any, board: any,enemy:any,empty:any, turn: boolean) {
	let moves=[]
	let moveable=enemy.map((x:any,i:any)=>x.map((y:any,j:any)=>y||empty[i][j]))
	let i = Math.floor(k/8)
	let j = k%8
	let directions = [[1,0],[0,-1],[-1,0],[0,1],[1,1],[1,-1],[-1,1],[-1,-1]]
	for(let x of directions){
		let i2 = i+x[0]
		let j2 = j+x[1]
		if(i2>=0 && i2<8 && j2>=0 && j2<8 && moveable[i2][j2])
			moves.push(i2*8+j2)
	}
	return moves
}

function checkForCheck(board:any,turn:boolean){
	let boardMatrix = "00000000".split("").map((_,i)=>board.slice(i*8,(i+1)*8).split(""))
	let emptySpaces = boardMatrix.map((x)=>x.map((y:any)=>y=="-"?true:false))
	let myPieces = boardMatrix.map((x)=>x.map((y:any)=>((turn?y.toUpperCase():y.toLowerCase())==y) && y!= "-"?true:false))
	let kingIndex = board.indexOf((turn?"K":"k"))
	let check=false
	for(let i = 0; i<64&&!check;i++){
		if(board[i]=="-")
			continue
		else if(turn&&board[i]>="a"){
			check=pieceDict[board[i].toLowerCase()](i,boardMatrix,myPieces,emptySpaces,!turn).includes(kingIndex)
		}
		else if(!turn&&board[i]<="Z"){check=pieceDict[board[i].toLowerCase()](i,boardMatrix,myPieces,emptySpaces,!turn).includes(kingIndex)}
		
	}
	if(check)
		console.log("CHECK")
	
}