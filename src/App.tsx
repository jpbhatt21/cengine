import React, { useEffect, useState } from "react";
import { pieces, theme } from "./theme";
import { checkForCheck, checkForAvailableMoves, moveManager, setData } from "./PieceMoves";
let md = false;
let pc = " -1";
function boardPositionToGlobalPosition(k: any) {
  let x = (8 - (k % 8) - 4.5) * 9.375 + 4;
  let y = (Math.floor(k / 8) - 3.5) * 9.375 + 4;

  return {
    top: "calc(50vh - " + y + "vmin)",
    left: "calc(50vw - " + x + "vmin)",
    pointerEvents:
      (turn && board[k] < "a") || (!turn && board[k] >= "a") ? "auto" : "none",
  };
}
let board = "RNBQKBNRPPPPPPPP--------------------------------pppppppprnbqkbnr";
let moveRecord:string[][]=[]
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
let promotion=-1
let currentMove=""
function moveTo(i: any) {
  if(promoting)return false
  if (i < 0 || i > 63) return false;
  if (mvSq[i] == 0) return false;
  let mv=""
  let enp = -1;
  let temp = board.split("");
  let piece = board[sel];
  let cast = NaN;
  let fromFile=Math.floor(sel/8)+1
  let toFile=Math.floor(i/8)+1
  let fromRank="abcdefgh"[sel%8]
  let toRank="abcdefgh"[i%8]
  let pieceType = piece.toLowerCase();
  let captured = board[i];
  if(pieceType!="p")
  mv+=pieceType.toUpperCase()
  if(piece.toLowerCase()=="p"&&captured!="-"){
    mv+=fromRank
  }
  if(captured!="-"){
    mv+="x"
  }
  mv+=toRank+""+toFile

  promotion=-1;
  promoting=false;
  if((piece=="p"&&i<8)|| (piece=="P"&&i>55)){
    promoting=true;
    promotion=i%8;
  }
  if (enpassant[0] != -1) {
    if (i == (enpassant[0] + (turn ? 1 : -1)) * 8 + enpassant[1]) {
      temp[enpassant[0] * 8 + enpassant[1]] = "-";
      enp = enpassant[0] * 8 + enpassant[1];
    }
  }
  if (piece.toLowerCase() == "k" && Math.abs(sel - i) == 2) {
    if (i % 8 == 6) {
      temp[i + 1] = "-";
      temp[i - 1] = turn ? "R" : "r";
      mv="O-O"
      cast = i + 1;
    }
    if (i % 8 == 2) {
      temp[i - 2] = "-";
      temp[i + 1] = turn ? "R" : "r";
      mv="O-O-O"
      cast = i - 2;
    }
  }
  if (piece.toLowerCase() == "r") {
    if (sel == pieceKeys[turn ? 1 : 7][0]) {
      castling[turn ? 0 : 2] = false;
    }
    if (sel == pieceKeys[turn ? 1 : 7][1]) {
      castling[turn ? 1 : 3] = false;
    }
  }

  pieceKeys = pieceKeys.map((x: any) => {
    return x.map((y: any) =>
      y == i || y == enp
        ? -1
        : y == sel
        ? i
        : y == cast
        ? [y + 3, y - 2][y % 2]
        : y
    );
  });
  mvSq = new Array(64).fill(0);
  if(!promoting)
  turn = !turn;

  enpassant = [-1, -1];

  if (piece.toLowerCase() == "p") {
    if (Math.abs(sel - i) == 16) enpassant = [Math.floor(i / 8), i % 8];
    fiftyMove = 0;
  } else if (board[i] == "-") {
    fiftyMove++;
  } else {
    fiftyMove = 0;
  }
  if (piece.toLowerCase() == "k") {
    castling[0 + (turn ? 2 : 0)] = false;
    castling[1 + (turn ? 2 : 0)] = false;
  }
  if (turn) {
    moves++;
  }
  to = i;
  from = sel;
  temp[i] = temp[sel];
  temp[sel] = "-";
  board = temp.join("");
  check = checkForCheck(board, turn);
  moveCount=checkForAvailableMoves(board,turn)
  if(check&&moveCount==0)
  mv+="#"
  else if(check)
  mv+="+"
  if(!promoting){
    if(!turn)
    moveRecord.push([mv])
    else
    moveRecord[moveRecord.length-1].push(mv)
  }
  else{
    currentMove=mv
  }
  setData(check, enpassant, castling, fiftyMove, moves);
  return true;
}
function normalize(x: number, y: number, str: string) {
  str = str
    .split(" ")
    .map((z, i) => parseInt(z) + (i % 2 == 0 ? x : y))
    .join(" ");
  return str;
}
function App() {
  console.log(moveRecord)
  const [clickCount, setClickCount] = useState(0);
  const [moveableSquares, setMoveableSquares] = useState(new Array(64).fill(0));
  if(moveCount==0&&check){
    console.log("Checkmate")
  }
  else if(moveCount==0){
    console.log("Stalemate")
  }else if(check){
    console.log("Check")
  }
  useEffect(() => {
    document.addEventListener("mousemove", (e) => {
      let piece = document.getElementById(pc);
      if (!piece) {
        return;
      }

      if (md) {
        piece.style.top = "calc( " + e.clientY + "px - 4vmin)";
        piece.style.left = "calc( " + e.clientX + "px - 4vmin)";
        piece.style.transitionDuration = "0s";
      }
    });

    document.addEventListener("mouseup", (e) => {
      if(promoting)return
      let i = sel;
      md = false;
      let piece = document.getElementById(pc);
      let to: any = (e.target as HTMLElement) || { id: "-1" };
      if (to.id.includes("boardsq")) {
        to = parseInt(to.id.replace("boardsq", ""));
      } else {
        to = -1;
      }

      let val1 = boardPositionToGlobalPosition(to);
      let val2 = boardPositionToGlobalPosition(i);
      let boox = moveTo(to);

      setMoveableSquares(mvSq);
      if (!piece) {
        return;
      }
      pc = "-1";
      piece.style.pointerEvents = "auto";
      piece.style.transitionDuration = "0.2s";
      let val = boox ? val1 : val2;
      piece.style.top = val.top;
      piece.style.left = val.left;
    });
  }, []);
  
  return (
    <>
      <div className="fixed flex w-full h-full items-center justify-center flex-col">
        <svg
          id="mainboard"
          xmlns="http://www.w3.org/2000/svg"
          className=" absolute h-[75vmin] aspect-square tms duration-200  mb-0 "
          viewBox="0 0 640 640"
          fill="none"
        >
          {moveableSquares.map((_, i) => {
            let x = (i % 8) * 80;
            let y = 560 - Math.floor(i / 8) * 80;
            return (
              <g key={"sq" + i}>
                <rect
                  id={"boardsq" + i}
                  key={i}
                  x={x}
                  y={y}
                  width="80"
                  height="80"
                  fill={
                    (i + Math.floor(i / 8)) % 2 == 1
                      ? theme.whiteBoard
                      : theme.blackBoard
                  }
                  className="duration-200"
                  stroke="#000"
                  strokeWidth="1"
                />

                {
                  <g
                    id="Page-1"
                    stroke="none"
                    className=" pointer-events-none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="diagonal-stripes"
                      className="duration-200"
                      fill={
                        check &&
                        ((turn && pieceKeys[5][0] == i) ||
                          (!turn && pieceKeys[11][0] == i)) &&
                        sel != i
                          ? "#312121"
                          : sel == i || from == i || to == i
                          ? (i + Math.floor(i / 8)) % 2 == 0
                            ? theme.whiteBoard +
                              (to == i ? "80" : from == i ? "80" : "FF")
                            : theme.blackBoard +
                              (to == i ? "80" : from == i ? "80" : "FF")
                          : "#0000"
                      }
                    >
                      <polygon
                        points={normalize(x, y, "2 38 38 2 19 2 2 19")}
                      ></polygon>
                      <polygon
                        points={normalize(x, y, "2 78 78 2 57 2 2 57")}
                      ></polygon>
                      <polygon
                        points={normalize(x, y, "19 78 78 19 78 38 38 78")}
                      ></polygon>
                      <polygon
                        points={normalize(x, y, "78 78 78 57 57 78")}
                      ></polygon>
                    </g>
                  </g>
                }

                {
                  <rect
                    x={(i % 8) * 80 + 32}
                    y={592 - Math.floor(i / 8) * 80}
                    width="16"
                    height="16"
                    rx="999"
                    fill={theme.move}
                    className="duration-200 pointer-events-none"
                    opacity={moveableSquares[i]}
                  />
                }
              </g>
            );
          })}
        </svg>
        {pieceKeys.map((x: any, j: any) => {
          return x.map((k: any, i: any) => {
            return (
              <div key={"test" + i + " " + j}>
                {k != -1 ? (
                  pieces[
                    `${j < 6 ? "0" : "1"}${(
                      j % 6
                    ).toString()}` as keyof typeof pieces
                  ]({
                    onMouseDown: (e: any) => {
                      if(promoting)return
                      if (!((turn && j < 6) || (!turn && j >= 6))) return;
                      mvSq =
                        moveManager(k, board, turn) || new Array(64).fill(0);
                      setMoveableSquares(mvSq);
                      e.currentTarget.style.pointerEvents = "none";
                      e.currentTarget.style.zIndex = clickCount + 1;
                      setClickCount(clickCount + 1);
                      sel = k;
                      md = true;
                      pc = `${j < 6 ? "0" : "1"}${(j % 6).toString()}` + i;
                    },

                    id: `${j < 6 ? "0" : "1"}${(j % 6).toString()}` + i,
                    style: boardPositionToGlobalPosition(k),

                    className: "duration-200 fixed z-[0]",
                    width: "8vmin",
                    height: "8vmin",
                  })
                ) : (
                  <></>
                )}
              </div>
            );
          });
        })}
        {promoting&&promoteKeys[turn ? 0 : 1].map((k, i) => (
          <div key={"prom" + i} style={{ zIndex: clickCount + 1}}>
            
            <div
              className="fixed z-[0] w-[8vmin] h-[8vmin]"
              style={
                {
                  ...boardPositionToGlobalPosition(k+promotion),
                  backgroundColor:
                    ((k+promotion) + Math.floor((k+promotion) / 8)) % 2 == 1
                      ? theme.whiteBoard
                      : theme.blackBoard
                } as React.CSSProperties
              }
            ></div>
            {pieces[
              `${turn ? "0" : "1"}${(
                (i + 1) %
                6
              ).toString()}` as keyof typeof pieces
            ]({
              onClick: (e: any) => {
                let piece=turn?"RNBQ"[i]:"rnbq"[i]
                let temp=board.split("")
                
                temp[(turn?56:0)+promotion]=piece
                board=temp.join("")
                pieceKeys[(turn?1:7)+i].push((turn?56:0)+promotion)
                pieceKeys[(turn?0:6)]=pieceKeys[(turn?0:6)].filter((x:any)=>x!=(turn?56:0)+promotion)
                
                setMoveableSquares(new Array(64).fill(0))
                promoting=false
                promotion=-1
                turn=!turn
                check=checkForCheck(board,turn)
                moveCount=checkForAvailableMoves(board,turn)
              },

              id: `${turn ? "0" : "1"}${((i + 1) % 6).toString()}prom` + i,
              style: {...boardPositionToGlobalPosition(k+promotion),"animationDelay":`${((i+1)%4)*0.25}s`},
              className: "glow fade-in fixed z-[0]",
              width: "8vmin",
              height: "8vmin",
            })}
          </div>
        ))}
        <svg
          id="mainboard2"
          xmlns="http://www.w3.org/2000/svg"
          className=" absolute h-[75vmin] aspect-square tms pointer-events-none duration-200  mb-0 "
          viewBox="0 0 640 640"
          style={{
            zIndex: clickCount - 1,
          }}
          fill="none"
        >
          {moveableSquares.map((_, i) => {
            return (
              <rect
                x={(i % 8) * 80 + 32}
                y={592 - Math.floor(i / 8) * 80}
                width="16"
                height="16"
                rx="999"
                key={"test2" + i}
                fill={theme.move}
                className="duration-200 pointer-events-none"
                opacity={moveableSquares[i]}
              />
            );
          })}
        </svg>
      </div>
    </>
  );
}

export default App;
