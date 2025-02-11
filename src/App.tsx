import { theme } from "./theme";
import { get, set } from "./variables";
import Board from "./Board";
import { useEffect, useState } from "react";
import { getEval, performSuggestedMove } from "./helperFunctions";
getEval();
function filter(obj: any, predicate: any) {
	for (let key in obj) {
		if (obj.hasOwnProperty(key) && !predicate(obj[key])) {
			delete obj[key];
		}
	}
	return obj;
}
function App() {
	useEffect(() => {
		setInterval(() => {
			if (!get.autoplay() || noMoveAvailable || tfr || insuff) return;
			performSuggestedMove();
			setUpdate((x) => x + 1);
		}, 100);
	}, []);
	const [_, setUpdate] = useState(0);
	if (get.updater() == null) set.updater(setUpdate);
	let moveRecord = get.moveRecord();
	let noMoveAvailable = get.noMoveAvailable();
	let check = get.check();
	let tfr = get.threeFoldReptition();
	let insuff = get.insufficientMaterial();
	let turn = get.turn();
	let eva = get.curEval();
	let currentHalfMove = get.currentHalfMove();
	let evamate = get.curEvalMate();
	let playOptions = get.playOptions();
	let positionHistory = get.positionHistory();
	// let mvr=[]
	// let timelineMoves = get.timelineMoves();
	// console.log(positionHistory)
	// for (let i = 0; i < timelineMoves.length; i++) {
	// 	let mvt=[]
	// 	for(let j=timelineMoves[i][0]; j<=timelineMoves[i][1]; j++){
	// 		console.log(i+"-"+j)
	// 		mvt.push(positionHistory[i+"-"+j].move)
	// 	}
	// 	mvr.push(mvt)

	// }
	// console.log(mvr)
	let keys = Object.keys(positionHistory);
	let mvr: any = {
		"0-0": {
			move: "0-0",
			alt: [],
			next: [positionHistory["0-0"].next],
			nx: null,
			prev: null,
		},
	};
	for (let i = 1; i < keys.length; i++) {
		let pos = positionHistory[keys[i]];
		if (!pos) continue;
		if (mvr[pos.previous].nx == null) {
			mvr[pos.previous].nx = keys[i];
		}
		mvr[keys[i]] = {
			move: pos.move,
			alt: [],
			next: pos.next ? [pos.next] : [],
			nx: null,
			prev: pos.previous,
		};
	}
	let nullCount = filter(
		JSON.parse(JSON.stringify(mvr)),
		(x: any) => x.nx == null
	);
	let key:any=Object.keys(nullCount);
	while (
		(key.length > 0 &&
		!nullCount.hasOwnProperty("0-0"))||key.length>1
	) {
		key = key[key.length - 1];
		let pos = mvr[key];
		let prev = mvr[pos.prev];
		if (prev.next[0] == key) {
			prev.next = [
				[pos.move, ...pos.alt],
				...(pos.next.length > 0 ? pos.next : []),
			];
		} else {
			mvr[prev.next].alt.push([
				[pos.move, ...pos.alt],
				...(pos.next.length > 0 ? pos.next : []),
			]);
		}
		prev.nx = null;
		mvr[pos.prev] = prev;
		delete mvr[key];

		nullCount = filter(
			JSON.parse(JSON.stringify(mvr)),
			(x: any) => x.nx == null
		);
		key=Object.keys(nullCount);
	}
	mvr=mvr["0-0"].next
	console.log(mvr)

	return (
		<>
			<div className="fixed flex mts w-full h-full items-center justify-center flex-col">
				<Board setUpdate={setUpdate} />
				<div className=" fixed pointer-events-none flex flex-col justify-center items-center w-[2.5vmin] h-[75vmin] pr-[42.5vmin] right-1/2 ">
					<div
						className="h-full w-[2.5vmin] flex border-2 flex-col-reverse"
						style={{
							backgroundColor: theme.blackPiece,
							borderColor: theme.whitePiece,
						}}>
						<div
							className="w-full "
							style={{
								backgroundColor: theme.whitePiece,
								height:
									50 +
									(evamate
										? eva > 0
											? 50
											: -50
										: eva *
										  5 *
										  (Math.abs(eva) < 10
												? 1
												: 2 /
												  (0.1 +
														Math.ceil(
															Math.abs(eva) / 5
														)))) +
									"%",
								transition: "height 0.5s",
								transitionTimingFunction: "ease-in-out",
							}}></div>
					</div>
					<div
						className="w-[10vmin] text-center items-center"
						style={{
							color: theme.move,
						}}>
						{noMoveAvailable || tfr || insuff
							? check
								? turn
									? "0-1"
									: "1-0"
								: "1/2 - 1/2"
							: evamate
							? "M" + Math.round(Math.abs(eva * 100))
							: eva}
					</div>
				</div>
				<div
					className="fixed w-[75vmin] aspect-square flex-col bg-black bg-opacity-20 flex items-center justify-center text-[7vmin] lexend duration-500 pointer-events-none"
					style={{
						zIndex: 2147483647,
						color: theme.move,
						opacity: noMoveAvailable || tfr || insuff ? 1 : 0,
					}}>
					{(noMoveAvailable || tfr || insuff) && (
						<>
							<label className="flyin">
								{check
									? "Checkmate"
									: tfr
									? "Threefold Repetion"
									: insuff
									? "Insufficient Material"
									: "Stalemate"}
							</label>
							<label className="flyin text-[4vmin]">
								{check && !tfr && !insuff
									? turn
										? "Black Won"
										: "White Won"
									: "Draw"}
							</label>
						</>
					)}
				</div>
				<div className=" fixed pointer-events-none flex flex-col items-center justify-center w-[50vw] h-[75vmin] pl-[37.5vmin] left-1/2 ">
					<div
						id="moveRecord"
						className="w-2/3 h-2/3 border-[1px] rounded-sm overflow-scroll pointer-events-auto flex flex-col items-center "
						style={{
							borderColor: theme.whitePiece,
							backgroundColor: theme.sel,
							color: theme.move,
						}}>
						<label
							className="sticky leading-[calc((50vw-37.5vmin)*2/32)] top-0 w-full border-b-[1px] text-center  text-[calc((50vw-37.5vmin)*2/64)]"
							style={{
								backgroundColor: theme.sel,
								borderColor: theme.whitePiece,
							}}
							onClick={() => {
								set.autoplay(!get.autoplay());
							}}>
							Moves
						</label>
						{moveRecord.map((x, i) => (
							<div
								key={"move" + i}
								className="w-full  text-[calc((50vw-37.5vmin)*2/80)] flex"
								style={{
									borderBottom:
										i != moveRecord.length - 1 ||
										document.getElementById("moveRecord")
											?.scrollHeight ==
											document.getElementById(
												"moveRecord"
											)?.clientHeight
											? "1px solid " + theme.pieceOutline
											: "",
									color: theme.text,
								}}>
								<label
									className="w-[10%] text-center   py-1 border-r-[1px] "
									style={{
										borderColor: theme.whitePiece,
										backgroundColor: theme.sel,
									}}>
									<label className="fadein">{i + 1}</label>
								</label>
								{x.map((y, j) => (
									<label
										style={{
											borderRight:
												j == 0
													? "1px solid " +
													  theme.pieceOutline
													: "",
											backgroundColor:
												currentHalfMove - 1 == i * 2 + j
													? "#313939"
													: i % 2 == 0
													? theme.blackBoard
													: theme.blackPiece,
										}}
										className="w-[45%] fadein py-1  text-center"
										key={"move" + i + j}>
										{y}
									</label>
								))}
							</div>
						))}
						<div
							className="sticky h-full w-[10%] self-start border-r-[1px] top-0"
							style={{
								borderColor: theme.whitePiece,
								backgroundColor: theme.sel,
							}}></div>
					</div>
				</div>
				<div className="fixed gap-1 flex flex-col top-1 left-1">
					<div className="flex gap-1">
						<div
							className="w-2 h-2 duration-200 rounded-full"
							style={{
								backgroundColor: theme.whitePiece,
								opacity: playOptions.playAsWhite ? 1 : 0,
							}}
						/>
						<div
							className="w-2 h-2 duration-200 rounded-full"
							style={{
								backgroundColor: theme.whitePiece,
								opacity: playOptions.showWhiteSuggestedMove
									? 1
									: 0,
							}}
						/>
						<div
							className="w-2 h-2 duration-200 rounded-full"
							style={{
								backgroundColor: theme.whitePiece,
								opacity: playOptions.playAsWhiteAI ? 1 : 0,
							}}
						/>
					</div>
					<div className="flex gap-1">
						<div
							className="w-2 h-2 duration-200 rounded-full"
							style={{
								backgroundColor: theme.whitePiece,
								opacity: playOptions.playAsBlack ? 1 : 0,
							}}
						/>
						<div
							className="w-2 h-2 duration-200 rounded-full"
							style={{
								backgroundColor: theme.whitePiece,
								opacity: playOptions.showBlackSuggestedMove
									? 1
									: 0,
							}}
						/>
						<div
							className="w-2 h-2 duration-200 rounded-full"
							style={{
								backgroundColor: theme.whitePiece,
								opacity: playOptions.playAsBlackAI ? 1 : 0,
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
