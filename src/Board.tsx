import { useEffect, useState } from "react";
import { get, set } from "./variables";
import {
	boardPositionToGlobalPosition,
	clearPieces,
	getArrowPos,
	getEval,
	moveTo,
	normalize,
	performSuggestedMove,
	postMoveActions,
	promote,
} from "./helperFunctions";
import { pieces, theme } from "./theme";
import { moveManager } from "./PieceMoves";
let flipBoard = !true;
function Board({ setUpdate }: any) {
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
	let pieceKeys = get.pieceKeys();
	let promoteKeys = get.promoteKeys();
	let turn = get.turn();
	let mvSq = get.mvSq();
	let promoting = get.promoting();
	let promotion = get.promotion();
	let thinking = get.thinking();
	let capturedPieces = get.capturedPieces();
	useEffect(() => {
		document.addEventListener("mousemove", (e) => {
			let piece = document.getElementById(get.pc());
			if (!piece) {
				return;
			}

			if (get.md()) {
				piece.style.top =
					"calc( " +
					(flipBoard ? window.innerHeight - e.clientY : e.clientY) +
					"px - 4vmin)";
				piece.style.left =
					"calc( " +
					(flipBoard ? window.innerWidth - e.clientX : e.clientX) +
					"px - 4vmin)";
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
			let boox: boolean = moveTo(to, piece);

			setMoveableSquares(get.mvSq());
			setUpdate((prev: any) => prev + 1);
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
			if (val) {
				piece.style.top = val.top;
				piece.style.left = val.left;
			}
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
		function updatePosition(data: any) {
			let px = document.getElementById(data.pieceId);
			if (px) {
				px.style.transitionDuration = "0.2s";
			}
			set.pieceKeys(data.pieceKeys);
			set.fiftyMove(data.fiftyMove);
			set.enpassant(data.enpassant);
			set.castling(data.castling);
			set.turn(data.turn);
			set.board(data.board);
			set.from(data.from);
			set.to(data.to);
			set.capturedPieces(data.capturedPieces);
			set.sel(-1);
			setMoveableSquares(new Array(64).fill(0));
			postMoveActions(get.all(),"");
			getEval();
			setUpdate((prev: any) => prev + 1);
		}
		document.addEventListener("keydown", (e) => {
			let positionHistory = get.positionHistory();
			let currentPosition = get.currentPosition();
			if (e.code == "ArrowLeft") {
				let prevPos = positionHistory[currentPosition].previous;
				if (prevPos != null) {
					set.currentPosition(prevPos);
					updatePosition(positionHistory[prevPos]);
					
				}
			}
			if (e.code == "ArrowRight") {
				let nextPos = positionHistory[currentPosition].next;
				if (nextPos != null) {
					set.currentPosition(nextPos);
					updatePosition(positionHistory[nextPos]);
					
				} 
				// else if (moveNext) {
				// 	if (
				// 		get.noMoveAvailable() ||
				// 		get.threeFoldReptition() ||
				// 		get.insufficientMaterial()
				// 	)
				// 		return;
				// 	performSuggestedMove();
				// 	setUpdate((x: any) => x + 1);
				// }
			}
		});
		document.addEventListener("keyup", (e) => {
			if (e.code == "ArrowRight") {
				// moveNext = true;
			}
		});
	}, []);

	return (
		<>
			<div
				className="fixed flex mts w-full h-full items-center justify-center flex-col"
				style={{
					transform: flipBoard ? "rotate(180deg)" : "",
				}}>
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
										className=" pointer-events-none">
										<g
											id="diagonal-stripes"
											className="duration-500"
											fill={
												check &&
												((turn &&
													pieceKeys[5][0] == i) ||
													(!turn &&
														pieceKeys[11][0] ==
															i)) &&
												sel != i
													? "#312121"
													: sel == i ||
													  from == i ||
													  to == i
													? (i + Math.floor(i / 8)) %
															2 ==
													  0
														? theme.whiteBoard +
														  (to == i
																? "80"
																: from == i
																? "80"
																: "FF")
														: theme.blackBoard +
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
						strokeWidth={5}></rect>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className=" absolute h-[75vmin] aspect-square tms pointer-events-none duration-200  mb-0 z-[2]"
					style={{
						zIndex:
							get.currentHalfMove() < get.currentMaxMoves()
								? 99
								: 2,
					}}
					viewBox="0 0 640 640"
					fill="none">
					{!(
						get.autoplay() ||
						get.noMoveAvailable() ||
						get.threeFoldReptition() ||
						get.insufficientMaterial()
					) && (
						<path
							fill="#5b5b5b"
							className=" pointer-events-none  duration-500 transition-opacity"
							// key={get.bestMove() + " " + get.moveRecord().length}
							style={{
								opacity: thinking
									? 0
									: get.currentHalfMove() <
									  get.currentMaxMoves()
									? 0.25
									: 0.75,
							}}
							d={getArrowPos(
								get.positionHistory()[get.currentPosition()].next!==null
									? "abcdefgh"[from % 8] +
											Math.floor(
												from / 8 + 1
											).toString() +
											"abcdefgh"[to % 8] +
											Math.floor(to / 8 + 1).toString()
									: get.bestMove()
							)}></path>
					)}
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
													get.currentHalfMove() <
													get.currentMaxMoves()
												)
													return;
												if (
													(turn && j < 6) ||
													(!turn && j >= 6)
												) {
													mvSq =
														moveManager(
															k,
															board,
															turn
														) ||
														new Array(64).fill(0);
													setMoveableSquares(mvSq);
												} else {
													mvSq = new Array(64).fill(
														0
													);
													setMoveableSquares(mvSq);
												}

												sel = k;
												md = true;
												let tempc =
													document.getElementById(pc);

												if (tempc) {
													tempc.style.zIndex = "1";
													if (get.bestPiecePC)
														(
															get.bestPiecePC() as HTMLElement
														).style.zIndex = "3";
												}
												e.currentTarget.style.pointerEvents =
													"none";
												e.currentTarget.style.zIndex = 10;
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
											style: {
												...boardPositionToGlobalPosition(
													k
												),
												...(((turn && j == 5) ||
													(!turn && j == 11)) &&
												get.check() &&
												get.noMoveAvailable()
													? {
															transform:
																"rotate(90deg)",
															animationDuration:
																"0.2s",
													  }
													: {
															transform: flipBoard
																? "rotate(180deg)"
																: "",
													  }),
											},

											className: "fixed z-[2] fadein",
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
						<div key={"prom" + i} style={{ zIndex: 5 }}>
							<div
								className="bg-black fixed w-[9vmin] ml-[-0.5vmin] fadein mt-[-0.5vmin] aspect-square"
								style={{
									...boardPositionToGlobalPosition(
										k + promotion
									),
									animationDelay: `0s`,
									pointerEvents: "none",
									backgroundColor:
										(k +
											promotion +
											Math.floor((k + promotion) / 8)) %
											2 ==
										1
											? theme.whiteBoard
											: theme.blackBoard,
								}}></div>
							{pieces[
								`${turn ? "0" : "1"}${(
									(i + 1) %
									6
								).toString()}` as keyof typeof pieces
							]({
								onClick: () => {
									promote(i, turn ? "rnbq"[i] : "RNBQ"[i]);
									setMoveableSquares(get.mvSq());
									setUpdate((prev: any) => prev + 1);
								},

								id:
									`${turn ? "0" : "1"}${(
										(i + 1) %
										6
									).toString()}prom` + i,
								style: {
									...boardPositionToGlobalPosition(
										k + promotion
									),
									animationDelay: `${((i + 1) % 4) * 0.25}s`,
									pointerEvents: "all",
								},
								className: "glow  fixed z-[0]",
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
						zIndex: 5,
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
								id={"move" + i}
								key={"test2" + i}
								fill={theme.move}
								className="duration-200"
								opacity={moveableSquares[i]}
							/>
						);
					})}
				</svg>
				<div
					id="whiteCapturedPieces"
					className="flex top-[88vmin] fixed  h-[5vmin] min-w-10"
					style={
						flipBoard
							? {
									right: "calc(50vw - 37.5vmin)",
									transform: "rotateY(180deg)",
							  }
							: {
									left: "calc(50vw - 37.5vmin)",
							  }
					}>
					{capturedPieces
						.split("")
						.filter((x) => x < "a")
						.map((x) =>
							pieces[
								("1" +
									"PRNBQK".indexOf(x)) as keyof typeof pieces
							]({
								className: "fadein",
								style: {
									transform: flipBoard
										? "rotate(180deg) rotateY(180deg)"
										: "",
								},
								id:`captured2${x}`,
							})
						)}
				</div>
				<div
					className="top-[7vmin] flex fixed h-[5vmin] min-w-10"
					style={
						flipBoard
							? {
									right: "calc(50vw - 37.5vmin)",
									transform: "rotateY(180deg)",
							  }
							: {
									left: "calc(50vw - 37.5vmin)",
							  }
					}>
					{capturedPieces
						.split("")
						.filter((x) => x >= "a")
						.map((x) =>
							pieces[
								("0" +
									"prnbqk".indexOf(x)) as keyof typeof pieces
							]({
								className: "fadein",
								style: {
									transform: flipBoard
										? "rotate(180deg) rotateY(180deg)"
										: "",
								},
								id:`captured${x}`,
							})
						)}
				</div>
			</div>
			<div
				className="top-[10vmin]  flex right-[calc(50vw-37.5vmin)] w-fit fixed"
				style={{
					color: theme.text,
				}}>
				Engine Depth :{" " + get.engineDepth()}
			</div>
		</>
	);
}

export default Board;
