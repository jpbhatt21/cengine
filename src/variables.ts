let md = false;
let pc = " -1";
let board = "rnbqkbnrpppppppp--------------------------------PPPPPPPPRNBQKBNR";
let moveRecord: string[][] = [];
// moveRecord=new Array(25).fill(["a","b"])
let pieceKeys = [
	[8, 9, 10, 11, 12, 13, 14, 15],
	[0, 7],
	[1, 6],
	[2, 5],
	[3],
	[4],
	[48, 49, 50, 51, 52, 53, 54, 55],
	[56, 63],
	[57, 62],
	[58, 61],
	[59],
	[60],
];
// let board = "----------------------------------q------k---------------K------";
// let pieceKeys = [
// 	[],
// 	[],
// 	[],
// 	[],
// 	[34],
// 	[41],
// 	[],
// 	[],
// 	[],
// 	[],
// 	[],
// 	[57],
// ];
let promoteKeys = [
	[48, 40, 32, 56],
	[8, 16, 24, 0],
];
let sel = -1;
let to = -1;
let from = -1;
let moveCount = 20;
let turn = true;
let mvSq = new Array(64).fill(0);
let check = false;
let enpassant = [-1, -1];
let castling = [true, true, true, true];
let fiftyMove = 0;
let moves = 0;
let promoting = false;
let promotion = -1;
let currentMove = "";
let clearAllTD: any = null;
export let get={
    md:()=>{return md},
    pc:()=>{return pc},
    board:()=>{return board},
    moveRecord:()=>{return moveRecord},
    pieceKeys:()=>{return pieceKeys},
    promoteKeys:()=>{return promoteKeys},
    sel:()=>{return sel},
    to:()=>{return to},
    from:()=>{return from},

    moveCount:()=>{return moveCount},
    turn:()=>{return turn},
    mvSq:()=>{return mvSq},
    check:()=>{return check},
    enpassant:()=>{return enpassant},
    castling:()=>{return castling},
    fiftyMove:()=>{return fiftyMove},
    moves:()=>{return moves},
    promoting:()=>{return promoting},
    promotion:()=>{return promotion},
    currentMove:()=>{return currentMove},
    clearAllTD:()=>{return clearAllTD},
    all:()=>{return {md,pc,board,moveRecord,pieceKeys,promoteKeys,sel,to,from,moveCount,turn,mvSq,check,enpassant,castling,fiftyMove,moves,promoting,promotion,currentMove,clearAllTD}}

}
export let set={
    md:(val:boolean)=>{md=val},
    pc:(val:string)=>{pc=val},
    board:(val:string)=>{board=val},
    moveRecord:(val:string[][])=>{moveRecord=val},
    pieceKeys:(val:number[][])=>{pieceKeys=val},
    promoteKeys:(val:number[][])=>{promoteKeys=val},
    sel:(val:number)=>{sel=val},
    to:(val:number)=>{to=val},
    from:(val:number)=>{from=val},
    moveCount:(val:number)=>{moveCount=val},
    turn:(val:boolean)=>{turn=val},
    mvSq:(val:number[])=>{mvSq=val},
    check:(val:boolean)=>{check=val},
    enpassant:(val:number[])=>{enpassant=val},
    castling:(val:boolean[])=>{castling=val},
    fiftyMove:(val:number)=>{fiftyMove=val},
    moves:(val:number)=>{moves=val},
    promoting:(val:boolean)=>{promoting=val},
    promotion:(val:number)=>{promotion=val},
    currentMove:(val:string)=>{currentMove=val},
    clearAllTD:(val:any)=>{clearAllTD=val},
    all:(val:any)=>{
        md=val.md;
        pc=val.pc;
        board=val.board;
        moveRecord=val.moveRecord;
        pieceKeys=val.pieceKeys;
        promoteKeys=val.promoteKeys;
        sel=val.sel;
        to=val.to;
        from=val.from;
        moveCount=val.moveCount;
        turn=val.turn;
        mvSq=val.mvSq;
        check=val.check;
        enpassant=val.enpassant;
        castling=val.castling;
        fiftyMove=val.fiftyMove;
        moves=val.moves;
        promoting=val.promoting;
        promotion=val.promotion;
        currentMove=val.currentMove;
        clearAllTD=val.clearAllTD;
    }


}
