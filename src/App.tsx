import { theme } from "./theme";
import { get } from "./variables";
import Board from "./Board";
import { useState } from "react";

function App() {
	// let tempx = moveRecord.map((x, i) => i + 1 + ". " + x.join(" ")).join(" ");
	// console.log(tempx);
	// 	new Array(64).fill(0)
	// );
	// if (moveCount == 0 && check) {
	// 	console.log("Checkmate");
	// } else if (moveCount == 0) {
	// 	console.log("Stalemate");
	// } else if (check) {
	// 	console.log("Check");
	// }
	const [_, setUpdate] = useState(0);
	let moveRecord = get.moveRecord();
	let moveCount =get.moveCount();
	let check = get.check();
	let turn = get.turn();
	return (
		<>
			<div className="fixed flex mts w-full h-full items-center justify-center flex-col">
				<Board setUpdate={setUpdate} />
				<div className="fixed w-[75vmin] aspect-square flex-col bg-black bg-opacity-20 flex items-center justify-center text-[7vmin] lexend duration-500 pointer-events-none" style={{zIndex:2147483647,color:theme.move, opacity:moveCount==0?1:0}}>
                {
                    moveCount==0&&<>
                    <label className="flyin">{check?"Checkmate":"Stalemate"}</label>
                    <label className="flyin text-[4vmin]">{check?turn?"Black Won":"White Won":"Draw"}</label>
                    </>
                }
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
									color: theme.move,
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
												i % 2 == 0
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

			</div>
		</>
	);
}

export default App;
