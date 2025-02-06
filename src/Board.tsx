import { useEffect, useState } from "react";
import { get, set } from "./variables";
import { boardPositionToGlobalPosition, clearPieces, moveTo, normalize } from "./helperFunctions";
import { pieces, theme } from "./theme";
import { checkForAvailableMoves, checkForCheck, moveManager } from "./PieceMoves";

function Board({setUpdate}:any) {
    
	const [clickCount, setClickCount] = useState(0);
	const [moveableSquares, setMoveableSquares] = useState(
		new Array(64).fill(0)
	);
	let check = get.check();
	let sel = get.sel();
	let from = get.from();
	let to = get.to();
	let md = get.md();
	let pc = get.pc();
	let board = get.board();
	let moveRecord = get.moveRecord();
	let pieceKeys = get.pieceKeys();
	let promoteKeys = get.promoteKeys();
	let turn = get.turn();
	let moveCount = get.moveCount();
	let mvSq = get.mvSq();
	let promoting = get.promoting();
	let promotion = get.promotion();
	let currentMove = get.currentMove();
	useEffect(() => {
		document.addEventListener("mousemove", (e) => {
			let piece = document.getElementById(get.pc());
			if (!piece) {
				return;
			}

			if (get.md()) {
				piece.style.top = "calc( " + e.clientY + "px - 4vmin)";
				piece.style.left = "calc( " + e.clientX + "px - 4vmin)";
				piece.style.transitionDuration = "0s";
			}
		});

		document.addEventListener("mouseup", (e) => {
			if (get.promoting()) return;
			let i = get.sel();
			set.md(false);
			let piece = document.getElementById(get.pc());
			let to: any = (e.target as HTMLElement) || { id: "-1" };
			if (to.id.includes("boardsq")) {
				to = parseInt(to.id.replace("boardsq", ""));
			} else {
				to = -1;
			}

			let val1 = boardPositionToGlobalPosition(to);
			let val2 = boardPositionToGlobalPosition(i);
			let boox:boolean = moveTo(to, piece) ;

			setMoveableSquares(get.mvSq());
            setUpdate((prev:any)=>prev+1);
            // console.log(setMoveRecord);
            // setMoveRecord(get.moveRecord());
			if (!piece) {
				return;
			}
			if (!boox) {
				let allPieces = document.getElementById("allPieces")?.children;
				for (let j = 0; allPieces && j < allPieces?.length; j++) {
					if (allPieces[j].firstChild) {
						(
							allPieces[j].firstChild as HTMLElement
						).style.transitionDuration = "0s";
					}
				}
			}

			piece.style.pointerEvents = "auto";
			piece.style.transitionDuration = "0.2s";

			let val = boox ? val1 : val2;
			piece.style.top = val.top;
			piece.style.left = val.left;
			let clearAllTD = get.clearAllTD();
			if (clearAllTD) {
				clearTimeout(clearAllTD);
				clearAllTD = null;
			}
			clearAllTD = setTimeout(() => {
				clearPieces();
			}, 500);
			set.clearAllTD(clearAllTD);
		});
	}, []);
	return (
		<>
			<svg
				id="mainboard"
				xmlns="http://www.w3.org/2000/svg"
				className="absolute  h-[75vmin] aspect-square tms  mb-0 "
				viewBox="0 0 640 640"
				fill="none">
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
								className="trex"
								stroke={theme.pieceOutline}
								strokeWidth="2"
							/>

							{
								<g
									id="Page-1"
									stroke="none"
									className=" pointer-events-none"
									
									>
									<g
										id="diagonal-stripes"
										className="duration-500"
										fill={
											check &&
											((turn && pieceKeys[5][0] == i) ||
												(!turn &&
													pieceKeys[11][0] == i)) &&
											sel != i
												? "#312121"
												: sel == i ||
												  from == i ||
												  to == i
												? (i + Math.floor(i / 8)) % 2 ==
												  0
													?theme.whiteBoard+
													  (to == i
															? "80"
															: from == i
															? "80"
															: "FF")
													:theme.blackBoard +
													  (to == i
															? "80"
															: from == i
															? "80"
															: "FF")
												: "#0000"
										}>
										<polygon
											points={normalize(
												x,
												y,
												"2 18 2 10 10 2 18 2"
											)}></polygon>
										<polygon
											points={normalize(
												x,
												y,
												"2 34 2 26 26 2 34 2"
											)}></polygon>
										<polygon
											points={normalize(
												x,
												y,
												"2 50 2 42 42 2 50 2"
											)}></polygon>
										<polygon
											points={normalize(
												x,
												y,
												"2 66 2 58 58 2 66 2"
											)}></polygon>
										<polygon
											points={normalize(
												x,
												y,
												"2 78 2 74 74 2 78 2 78 6 6 78"
											)}></polygon>
										<polygon
											points={normalize(
												x,
												y,
												"14 78 22 78 78 22 78 14"
											)}></polygon>
										<polygon
											points={normalize(
												x,
												y,
												"30 78 38 78 78 38 78 30"
											)}></polygon>
										<polygon
											points={normalize(
												x,
												y,
												"46 78 54 78 78 54 78 46"
											)}></polygon>
										<polygon
											points={normalize(
												x,
												y,
												"62 78 70 78 78 70 78 62"
											)}></polygon>
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
									className="pointer-events-none duration-200"
									opacity={moveableSquares[i]}
								/>
							}
						</g>
					);
				})}
                <rect
                width={640}
                height={640}
                stroke={theme.pieceOutline}
                strokeWidth={5}
                ></rect>
			</svg>
			<div id="allPieces">
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
											if (promoting) return;
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
											set.mvSq(mvSq);
											set.sel(sel);
											set.md(md);
											set.pc(pc);
										},

										id:
											`${j < 6 ? "0" : "1"}${(
												j % 6
											).toString()}` + i,
										style:{...boardPositionToGlobalPosition(k),...((((turn&&j==5)||(!turn && j==11))&&get.check()&&get.moveCount()==0)?{transform:"rotate(90deg)",animationDuration:"0.2s"}:{})},

										className: "fixed z-[0]",
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
			</div>
			{promoting &&
				promoteKeys[turn ? 0 : 1].map((k, i) => (
					<div key={"prom" + i} style={{ zIndex: clickCount + 1 }}>
						
						{pieces[
							`${turn ? "0" : "1"}${(
								(i + 1) %
								6
							).toString()}` as keyof typeof pieces
						]({
							onClick: () => {
								let piece = turn ? "rnbq"[i] : "RNBQ"[i];
								let temp = board.split("");

								temp[(turn ? 56 : 0) + promotion] = piece;
								board = temp.join("");
								pieceKeys[(turn ? 1 : 7) + i].push(
									(turn ? 56 : 0) + promotion
								);
								pieceKeys[turn ? 0 : 6] = pieceKeys[
									turn ? 0 : 6
								].map((x: any) =>
									x == (turn ? 56 : 0) + promotion ? -1 : x
								);
								mvSq = new Array(64).fill(0);
								promoting = false;
								promotion = -1;
								turn = !turn;
								check = checkForCheck(board, turn);
								moveCount = checkForAvailableMoves(board, turn);
								currentMove += "=" + piece.toUpperCase();
								if (check && moveCount == 0) currentMove += "#";
								else if (check) currentMove += "+";
								if (!turn) moveRecord.push([currentMove]);
								else
									moveRecord[moveRecord.length - 1].push(
										currentMove
									);
								set.board(board);
								set.promoting(promoting);
								set.promotion(promotion);
								set.turn(turn);
								set.check(check);
								set.moveCount(moveCount);
								set.currentMove(currentMove);
								set.moveRecord(moveRecord);
								set.mvSq(mvSq);
								set.pieceKeys(pieceKeys);
								setMoveableSquares(mvSq);
                                setUpdate((prev:any)=>prev+1);
							},

							id:
								`${turn ? "0" : "1"}${(
									(i + 1) %
									6
								).toString()}prom` + i,
							style: {
								...boardPositionToGlobalPosition(k + promotion),
								animationDelay: `${((i + 1) % 4) * 0.25}s`,
								pointerEvents: "all",
							},
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
				fill="none">
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
            
		</>
	);
}

export default Board;
