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
    opacity:k==-1?0:1,
    pointerEvents:turn&&board[k]<"a"||!turn&&board[k]>="a"?"auto":"none",
    transitionDuration:k==-1?"0s":"0.2s"

	};
}
let board = "RNBQKBNRPPPPPPPP--------------------------------pppppppprnbqkbnr";
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
let sel = -1;
let turn = true;
let mvSq = new Array(64).fill(0);
function moveTo(i: any) {
	if (i < 0 || i > 63) return false;
	if (mvSq[i] == 0) return false;
	pieceKeys = pieceKeys.map((x: any) => {
		return x.map((y: any) => (y == i ? -1 : y == sel ? i : y));
	});
	mvSq = new Array(64).fill(0);
	turn = !turn;
	let temp = board.split("");
	temp[i] = temp[sel];
	temp[sel] = "-";
	board = temp.join("");
	return true;
}
function App() {
	const [clickCount, setClickCount] = useState(0);
	const [moveableSquares, setMoveableSquares] = useState(
		new Array(64).fill(0)
	);
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
					fill="none">
					{moveableSquares.map((_, i) => {
						return (
							<>
								<rect
									id={"boardsq" + i}
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
								/>
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
								
							</>
						);
					})}
				</svg>
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
										if (
											!(
												(turn && j < 6) ||
												(!turn && j >= 6)
											)
										)
											return;
										mvSq =
											moveManager(k, board, turn) ||
											new Array(64).fill(0);
										setMoveableSquares(mvSq);
										e.currentTarget.style.pointerEvents =
											"none";
										e.currentTarget.style.zIndex =
											clickCount + 1;
										setClickCount(clickCount + 1);
										sel = k;
										md = true;
										pc =
											`${j < 6 ? "0" : "1"}${(
												j % 6
											).toString()}` + i;
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
        <svg
					id="mainboard2"
					xmlns="http://www.w3.org/2000/svg"
					className=" absolute h-[75vmin] aspect-square tms pointer-events-none duration-200  mb-0 "
					viewBox="0 0 640 640"
          style={{
            zIndex:clickCount-1
          }}
					fill="none">
					{moveableSquares.map((_, i) => {
						return (
							<>
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
								
							</>
						);
					})}
				</svg>
        
			</div>
		</>
	);
}

export default App;
