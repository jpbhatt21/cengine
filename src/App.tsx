import { useEffect, useState } from "react";
import { pieces, theme } from "./theme";
import { pawnMoves, whiteCaptures, whitePawnMoves } from "./PieceMoves";
let md = false;
for(let i=0;i<8;i++){
  let str=""
  for(let j=0;j<8;j++){
  str+=whiteCaptures[i*8+j]+" , "
  }
  str=""
}
let pc = " -1";
const blank = "0".repeat(64).split("");
function boardPositionToGlobalPosition(k: any) {
	k = k - 1;
	let x = (8-(k % 8) - 4.5) * 9.375 + 4;
	let y = (Math.floor(k / 8) - 3.5) * 9.375 + 4;

	return {
		top: "calc(50vh - " + y + "vmin)",
		left: "calc(50vw - " + x + "vmin)",
	};
}
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
let fullBoard = BigInt(0)
board.forEach((x) => {
  fullBoard = fullBoard |x;
});
console.log(fullBoard.toString(2),BigInt("1111111111111111000000000000000000000000000000001111111111111111"));
const pieceKeys = [
	[9, 10, 11, 12, 13, 14, 15, 16],
	[1, 8],
	[2, 7],
	[3, 6],
	[4],
	[5],
	[49, 50, 51, 52, 53, 54, 55, 56],
	[57, 64],
	[58, 63],
	[59, 62],
	[60],
	[61],
];
function App() {
	const [clickCount, setClickCount] = useState(0);
	const [downPiece, setDownPiece] = useState(-1);
  const [attackableSquares, setAttackableSquares] = useState(blank);
  const [selectedPiece,setSelectedPiece] = useState(-1);
  const [tempblank,setTempBlank] = useState(blank);
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
			(pc = "-1"), setPieceID("null");
			let piece = document.getElementById(pieceID);
			if (!piece) {
				return;
			}
			piece.style.transitionDuration = "0.2s";
			let val = boardPositionToGlobalPosition(i + 1);
			piece.style.top = val.top;
			piece.style.left = val.left;
		});
	});

	return (
		<>
			<div className="fixed flex w-full h-full items-center justify-center flex-col">
				<svg
					id="mainboard"
					xmlns="http://www.w3.org/2000/svg"
					className=" absolute h-[75vmin] aspect-square tms duration-200  mb-0 "
					viewBox="0 0 640 640"
					fill="none">
					{attackableSquares.map((x: any, i) => {
						return (
              <>
							<rect
								key={i}
								x={(i % 8) * 80}
								y={560 - Math.floor(i / 8) * 80}
								width="80"
								height="80"
								fill={								(i + Math.floor(i / 8)) % 2 == 1
										? theme.whiteBoard
										: theme.blackBoard
								}
								stroke="#000"
								strokeWidth="1"
                onClick={()=>{
                  let temp= [...tempblank];
                  if(temp[63-i]=="1"){
                    temp[63-i]="0";
                  }
                  else{
                    temp[63-i]="1";
                  }
                  setTempBlank(temp);
                }}
							/>
              {<rect
								x={(i % 8) * 80+32}
								y={592 - Math.floor(i / 8) * 80}
								width="16"
								height="16"
                rx="999"
								fill={		theme.move
								}
                className="duration-200"
                opacity={attackableSquares[63-i]}
                onClick={()=>{
                  let temp= [...tempblank];
                  if(temp[63-i]=="1"){
                    temp[63-i]="0";
                  }
                  else{
                    temp[63-i]="1";
                  }
                  setTempBlank(temp);
                }}
							/>}
              </>
						);
					})}
				</svg>
        
        <div className="text-white absolute right-0 bottom-0"
        onClick={()=>{
          let temp=[]
          let y=""
          tempblank.map((x,i)=>{
            if(i%8==0 && i!==0){
              temp.push(y)
              y=""
            }
            y=y+x
          })
          temp.push(y)
          console.log((parseInt(temp.join(""),2).toString()));
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
                    if(j%6==0){
                      console.log(k)
                      setAttackableSquares(pawnMoves(k-1,board,fullBoard,j<6))
                    }
                    else{
                      setAttackableSquares(blank)
                    }
										e.currentTarget.style.zIndex =
											clickCount + 1;
										setClickCount(clickCount + 1);
										setDownPiece(k);
										md = true;
										(pc =
											`${j < 6 ? "0" : "1"}${(
												j % 6
											).toString()}` + i),
											setPieceID(pc);
									},

									id:
										`${j < 6 ? "0" : "1"}${(
											j % 6
										).toString()}` + i,
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
