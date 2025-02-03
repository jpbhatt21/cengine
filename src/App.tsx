import { useEffect, useState } from "react";
import { pieces, theme } from "./theme";
import { moveManager } from "./PieceMoves";
let md = false;
let pc = " -1";
function boardPositionToGlobalPosition(k: any) {
  let x = (8 - (k % 8) - 4.5) * 9.375 + 4;
  let y = (Math.floor(k / 8) - 3.5) * 9.375 + 4;

  return {
    top: "calc(50vh - " + y + "vmin)",
    left: "calc(50vw - " + x + "vmin)",
  };
}
let board =
  "RNBQKBNRPPPPPPPP--------------------------------pppppppprnbqkbnr";
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
let sel=-1
let turn = true;
function App() {
  const [clickCount, setClickCount] = useState(0);
  const [downPiece, setDownPiece] = useState(-1);
  const [moveableSquares, setMoveableSquares] = useState(new Array(64).fill(0));
  const [pieceID, setPieceID] = useState("null");
  useEffect(() => {
    document.addEventListener("mousemove", (e) => {
      let piece = document.getElementById(pc);
      if (!piece) {
        return;
      }
      let boardDim = document
        .getElementById("mainboard")
        ?.getBoundingClientRect() || { x: 0, y: 0 };

      if (md) {
        piece.style.top = "calc( " + e.clientY + "px - 4vmin)";
        piece.style.left = "calc( " + e.clientX + "px - 4vmin)";
        piece.style.transitionDuration = "0s";
      }
    });

    document.addEventListener("mouseup", () => {
      let i = downPiece - 1;
      setDownPiece(-1);
      md = false;
      let piece = document.getElementById(pc);
      if (!piece) {
        return;
      }
	  console.log(pc)
      pc = "-1" 
	  setPieceID("null");
      piece.style.transitionDuration = "0.2s";
      let val = boardPositionToGlobalPosition(i + 1);
      piece.style.top = val.top;
      piece.style.left = val.left;
    });
  });
  console.log(pieceKeys);
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
          {moveableSquares.map((x: any, i) => {
            return (
              <>
                <rect
                  key={i}
                  x={(i % 8) * 80}
                  y={560 - Math.floor(i / 8) * 80}
                  width="80"
                  height="80"
                  fill={
                    (i + Math.floor(i / 8)) % 2 == 1
                      ? theme.whiteBoard
                      : theme.blackBoard
                  }
                  stroke="#000"
                  strokeWidth="1"
                  onClick={() => {
                   
                  }}
                />
                {
                  <rect
                    x={(i % 8) * 80 + 32}
                    y={592 - Math.floor(i / 8) * 80}
                    width="16"
                    height="16"
                    rx="999"
                    fill={theme.move}
                    className="duration-200"
                    opacity={moveableSquares[i]}
                    onClick={() => {
						if(moveableSquares[i] == 0)
							return
						console.log(i,sel)
						pieceKeys=pieceKeys.map((x: any, j: any) => {
							return x.map((y: any, k: any) => (y==i?-1:y==sel?i:y));

						});
						setMoveableSquares(new Array(64).fill(0));
						turn=!turn;
						let temp=board.split("");
						temp[i]=temp[sel];
						temp[sel]="-";
						board=temp.join("");
						setPieceID("null");
						
                    //   let temp = [...tempblank];
                    //   if (temp[63 - i] == "1") {
                    //     temp[63 - i] = "0";
                    //   } else {
                    //     temp[63 - i] = "1";
                    //   }
                    //   setTempBlank(temp);
                    }}
                  />
                }
              </>
            );
          })}
        </svg>

        <div
          className="text-white absolute right-0 bottom-0"
          onClick={() => {
            let temp = [];
            let y = "";
            tempblank.map((x, i) => {
              if (i % 8 == 0 && i !== 0) {
                temp.push(y);
                y = "";
              }
              y = y + x;
            });
            temp.push(y);
            console.log(parseInt(temp.join(""), 2).toString());
          }}
        >
          test
        </div>
        {pieceKeys.map((x: any, j: any) => {
          return x.map((k: any, i: any) => {
            return (
              <>
                {pieces[
                  `${j < 6 ? "0" : "1"}${(
                    j % 6
                  ).toString()}` as keyof typeof pieces
                ]({
                  onMouseDown: (e: any) => {
                    if (!((turn && j < 6) || (!turn && j >= 6))) return;
                    setMoveableSquares(moveManager(k, board, turn));
                    e.currentTarget.style.zIndex = clickCount + 1;
                    setClickCount(clickCount + 1);
                    setDownPiece(k);
					sel=k
                    md = true;
                    pc = `${j < 6 ? "0" : "1"}${(j % 6).toString()}` + i
					setPieceID(pc);
                  },

                  id: `${j < 6 ? "0" : "1"}${(j % 6).toString()}` + i,
                  style: boardPositionToGlobalPosition(k),

                  className: "duration-200 fixed z-[0]",
                  width: "8vmin",
                  height: "8vmin",
                })}
              </>
            );
          });
        })}
      </div>
    </>
  );
}

export default App;
