import { checkForInsufficientMaterial } from "./helperFunctions";
import { checkForAvailableMoves } from "./PieceMoves";

let md = false;
let pc = " -1";
let moveRecord: string[][] = [];
// moveRecord=new Array(25).fill(["a","b"])

let autoplay = false;
let stalemateTest = !false;  
let board = "rnbqkbnrpppppppp--------------------------------PPPPPPPPRNBQKBNR";
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
if(stalemateTest)board = "-----------------------------------------k------------p--K------";
if(stalemateTest)pieceKeys = [
	[54],
	[],
	[],
	[],
	[],
	[41],
	[],
	[],
	[],
	[],
	[],
	[57],
];
let promoteKeys = [
	[48, 40, 32, 56],
	[8, 16, 24, 0],
];
let sel = -1;
let bestMove="a1a1"
let curEval=0;
let curEvalMate=false;
let to = -1;
let from = -1;
let turn = true;
let mvSq = new Array(64).fill(0);
let check = false;
let enpassant = [-1, -1];
let castling = [true, true, true, true];
if(stalemateTest)castling = [false, false, false, false];
let fiftyMove = 0;
let moves = 0;
let promoting = false;
let promotion = -1;
let currentMove = "";
let clearAllTD: any = null;
let bestPiecePC:any=null;
let updater: any = null;
let noMoveAvailable = checkForAvailableMoves(board, turn);
let threeFoldReptition = false;
let insufficientMaterial=checkForInsufficientMaterial(board);
let thinking = true     ;   
export let get={
    insufficientMaterial:()=>{return insufficientMaterial},
    bestPiecePC:()=>{return bestPiecePC},
    thinking:()=>{return thinking},
    threeFoldReptition:()=>{return threeFoldReptition},
    autoplay:()=>{return autoplay},
    bestMove:()=>{return bestMove},
    updater:()=>{return updater},
    md:()=>{return md},
    pc:()=>{return pc},
    board:()=>{return board},
    moveRecord:()=>{return moveRecord},
    pieceKeys:()=>{return pieceKeys},
    promoteKeys:()=>{return promoteKeys},
    sel:()=>{return sel},
    to:()=>{return to},
    from:()=>{return from},
    curEval:()=>{return curEval},
    curEvalMate:()=>{return curEvalMate},
    noMoveAvailable:()=>{return noMoveAvailable},
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
    all:()=>{return {insufficientMaterial,md,pc,board,moveRecord,pieceKeys,promoteKeys,sel,to,from,noMoveAvailable,turn,mvSq,check,enpassant,castling,fiftyMove,moves,promoting,promotion,currentMove,clearAllTD,threeFoldReptition}}

}
export let set={
    insufficientMaterial:(val:boolean)=>{insufficientMaterial=val},
    bestPiecePC:(val:any)=>{bestPiecePC=val},
    thinking:(val:boolean)=>{thinking=val},
    threeFoldReptition:(val:boolean)=>{threeFoldReptition=val},
    autoplay:(val:boolean)=>{autoplay=val},
    bestMove:(val:string)=>{bestMove=val},
    updater:(val:any)=>{updater=val},
    curEval:(val:number)=>{curEval=val},
    curEvalMate:(val:boolean)=>{curEvalMate=val},
    md:(val:boolean)=>{md=val},
    pc:(val:string)=>{pc=val},
    board:(val:string)=>{board=val},
    moveRecord:(val:string[][])=>{moveRecord=val},
    pieceKeys:(val:number[][])=>{pieceKeys=val},
    promoteKeys:(val:number[][])=>{promoteKeys=val},
    sel:(val:number)=>{sel=val},
    to:(val:number)=>{to=val},
    from:(val:number)=>{from=val},
    noMoveAvailable:(val:boolean)=>{noMoveAvailable=val},
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
        noMoveAvailable=val.noMoveAvailable;
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
        threeFoldReptition=val.threeFoldReptition;
        insufficientMaterial=val.insufficientMaterial;
    }


}
