"use strict";
const Player = (name, marker, active = true) => {
	const getName = () => name;
	const getMarker = () => marker;
	return { name, getName, getMarker, active };
};

const GameAI = (marker, active = false) => {
	const getMarker = () => marker;
	const defenseAI = function (arr) {
		// let newArr = arr.slice();
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] === "") {
				arr[i] = marker === "O" ? "X" : "O";
				// console.log(newArr, i);
				// if (!checkWin(arr)) {
				// 	arr[i] = "";
				// 	// console.log(i);
				// 	// continue;
				// }
				if (gamePlay.checkWin(arr)) {
					console.log("block", i);
					arr[i] = marker;
					return arr;
				}
				arr[i] = "";
			}
		}
	};

	const offenseAI = function (arr) {
		// let newArr = arr.slice();
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] === "") {
				arr[i] = marker;
				if (!gamePlay.checkWin(arr)) {
					arr[i] = "";
					continue;
				}
				if (gamePlay.checkWin(arr)) {
					console.log("win", i);
					return arr;
				}
			}
		}
	};

	const randomAI = function (arr) {
		// let randNum = Math.floor(Math.random() * 9);
		// let emptySqArr = [];
		// console.log({ randNum });
		// for (let i = 0; i < arr.length; i++) {
		// 	if (arr[i]) return;
		// 	emptySqArr.push(i);
		// }

		let emptySqArr = [];
		for (let i = 0; i < arr.length; i++) {
			if (arr[i]) continue;
			emptySqArr.push(i);
		}
		console.log(emptySqArr);
		let x = Math.floor(Math.random() * emptySqArr.length);
		console.log(x, emptySqArr[x]);
		let index = emptySqArr[x];
		arr[index] = marker;
		// console.log(arr);
		// while (arr[x]) {
		// 	console.log(arr[x], x);
		// 	x = Math.floor(Math.random() * 9);
		// }
		// arr[x] = marker;
		return arr;
	};

	const selectionAI = function (arr) {
		if (offenseAI(arr)) return offenseAI(arr);
		if (defenseAI(arr)) return defenseAI(arr);
		return randomAI(arr);
	};
	return { selectionAI, getMarker, active };
};

const gamePlay = (() => {
	const playerSelectBtn = document.querySelector(".player-select");
	const form = document.querySelector("form");
	const playerName = document.querySelector(".player-name");
	const playerMarker = document.querySelector(".player-marker");
	const winMessage = document.querySelector(".win-message");
	let player2;
	let player1;
	let gameActive = false;

	playerSelectBtn.addEventListener("click", () => {
		form.classList.remove("hidden");
	});

	form.addEventListener("submit", function (e) {
		e.preventDefault();
		const name = form.querySelector("#name").value;
		const marker = form.querySelector("input[name='marker']:checked").id;
		player1 = Player(name, marker);
		// player2 = Player(
		// 	"computer",
		// 	player1.getMarker() === "X" ? "O" : "X",
		// 	false
		// );
		player2 = GameAI(player1.getMarker() === "X" ? "O" : "X");
		playerName.innerHTML = player1.getName();
		playerMarker.innerHTML = player1.getMarker();
		form.classList.add("hidden");
		gameActive = true;
	});

	const checkWin = function (arr) {
		const horizontalWin = [1, 3];
		const verticalWin = [3, 1];
		const diagonalWinA = [4, 2];
		const diagonalWinB = [2, 2];

		const calcWin = function (arr, arrInc, setInc) {
			let win = false;
			// let inc = setInc === 2 ? 2 : setInc * 3;
			let inc = setInc * 3;
			for (let i = arrInc === 2 ? 2 : 0; i < inc; i += setInc) {
				const a = arr[i];
				const b = arr[i + arrInc];
				const c = arr[i + arrInc * 2];

				let win = a === b && a === c ? true : false;
				if (win && a && b && c) return win;
			}
			return win;
		};

		if (calcWin(arr, ...horizontalWin)) return true;
		if (calcWin(arr, ...verticalWin)) return true;
		if (calcWin(arr, ...diagonalWinA)) return true;
		if (calcWin(arr, ...diagonalWinB)) return true;
		return false;
	};

	const checkDraw = (arr) => {
		for (let i = 0; i < arr.length; i++) {
			if (!arr[i]) return false;
		}
		return true;
	};
	// alternate between player and computer rounds with active key
	// const activePlayer = document.querySelector(".active");
	const toggleActive = (players) => {
		players.forEach((player) => {
			player.active = player.active ? false : true;
		});
	};
	const squareSelection = (square) => {
		if (!gameActive || square.innerHTML) return;

		const activePlayer = player1.active ? player1 : player2;

		if (!square.innerHTML) {
			gameBoardDisplay.boardArr[square.dataset.num] = player1.getMarker();
			gameBoardDisplay.renderBoard();
			if (checkWin(gameBoardDisplay.boardArr)) {
				winMessage.innerHTML = `${player1.getName()} wins!`;
				// gameActive = false;
				return;
			}
			toggleActive([player1, player2]);
			player2.selectionAI(gameBoardDisplay.boardArr);
			gameBoardDisplay.renderBoard();
			if (checkWin(gameBoardDisplay.boardArr)) {
				winMessage.innerHTML = `Computer wins!`;
				// gameActive = false;
				return;
			}
			toggleActive([player1, player2]);
			if (checkDraw(gameBoardDisplay.boardArr)) {
				winMessage.innerHTML = `Draw`;
				return;
			}
		}

		// if (checkWin(gameBoardDisplay.boardArr)) {
		// 	winMessage.innerHTML = `${activePlayer.getName()} wins!`;
		// 	gameActive = false;
		// }
	};
	return { squareSelection, checkWin };
})();

const gameBoardDisplay = (() => {
	const board = document.querySelector(".game-board");
	const squares = document.querySelectorAll(".square");
	const inputs = document.querySelectorAll(".square-input");
	let boardArr = ["", "", "", "", "", "", "", "", ""];
	const renderBoard = () => {
		squares.forEach((square) => {
			square.innerHTML = boardArr[square.dataset.num];
		});
	};
	squares.forEach((square) => {
		square.addEventListener("click", () => {
			gamePlay.squareSelection(square);
		});
	});
	return { boardArr, renderBoard };
})();

// const player1 = Player("Josh", "X");

// gamePlay.toggleActive(player1);
// console.log(player1);

// 1) player selects name and chooses X's or O's and the player object is created/ display is updated with this information and then the input disabled during game play.
// 2) game play is initiated.
// 3) during game play, input is alternating between player and comp. When player clicks on a square, it is filled in with the player marker. Then the computer auto fills a square.
// 4) the computer chooses where to place a marker based on overall board and where there is an opening between player selected squares to block or win if able between it's own squares.
// 5) each time a square is selected by either player or computer, it is updated using the gameBoard module function.

let arr = ["", "", "", "", "", "", "", "", ""];
let arr2 = ["x", "", "x", "", "", "o", "", "", "o"];
let arr3 = ["x", "o", "", "", "o", "x", "", "", ""];
let arr4 = ["a", 1, "a", 3, "a", 5, "a", 7, 8];
let arr5 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let arr6 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let test = ["x", "o", "x", "x", "o", "", "o", "x", "o"];

const squares = document.querySelectorAll(".square");

// console.log(calcWin(arr4, 1, 3));
// const checkWin = function (arr) {
// 	const horizontalWin = [1, 3];
// 	const verticalWin = [3, 1];
// 	const diagonalWinA = [4, 2];
// 	const diagonalWinB = [2, 2];

// 	const calcWin = function (arr, arrInc, setInc) {
// 		let win = false;
// 		let inc = setInc === 2 ? 2 : setInc * 3;
// 		for (let i = arrInc === 2 ? 2 : 0; i < inc; i += setInc) {
// 			const a = arr[i];
// 			const b = arr[i + arrInc];
// 			const c = arr[i + arrInc * 2];
// 			let win = a === b && a === c ? true : false;
// 			if (win && a && b && c) {
// 				console.log({ a, b, c, i });
// 				return win;
// 			}
// 		}
// 		return win;
// 	};

// 	if (calcWin(arr, ...horizontalWin)) {
// 		console.log("horizontalWin");
// 		return true;
// 	}
// 	if (calcWin(arr, ...verticalWin)) {
// 		console.log("verticalWin");
// 		return true;
// 	}
// 	if (calcWin(arr, ...diagonalWinA)) {
// 		console.log("diagonalWinA");
// 		return true;
// 	}
// 	if (calcWin(arr, ...diagonalWinB)) {
// 		console.log("diagonalWinB");
// 		return true;
// 	}
// 	return false;
// };

// const compareArr = function (arr1, arr2) {
// 	for (let i = 0; i < arr1.length; i++) {
// 		if (arr1.length !== arr2.length) return false;
// 		if (arr1[i] !== arr2[i]) return false;
// 	}
// 	return true;
// };

// const playerAI = {
// 	marker: "o",

// 	defenseAI(arr) {
// 		let newArr = arr.slice();
// 		for (let i = 0; i < newArr.length; i++) {
// 			if (newArr[i] === "") {
// 				newArr[i] = "x";
// 				// console.log(newArr, i);
// 				if (!checkWin(newArr)) {
// 					newArr[i] = "";
// 					// console.log(i);
// 					continue;
// 				}
// 				if (checkWin(newArr)) {
// 					console.log("block", i);
// 					newArr[i] = "o";
// 					console.log(newArr);
// 					return newArr;
// 				}
// 			}
// 		}
// 	},

// 	offenseAI(arr) {
// 		let newArr = arr.slice();
// 		for (let i = 0; i < newArr.length; i++) {
// 			if (newArr[i] === "") {
// 				newArr[i] = "o";
// 				if (!checkWin(newArr)) {
// 					newArr[i] = "";
// 					continue;
// 				}
// 				if (checkWin(newArr)) {
// 					console.log("win", i);
// 					return newArr;
// 				}
// 			}
// 		}
// 	},

// 	randomAI(arr) {
// 		// let newArr = arr.slice(0);
// 		// let x = Math.floor(Math.random() * 9);
// 		// console.log({ x });
// 		// while (arr[x]) {
// 		// 	console.log(arr[x], x);
// 		// 	x = Math.floor(Math.random() * 9);
// 		// }
// 		// arr[x] = "o";
// 		// return arr;
// 		// let randNum = Math.floor(Math.random() * 9);
// 		let emptySqArr = [];
// 		for (let i = 0; i < arr.length; i++) {
// 			if (arr[i]) continue;
// 			emptySqArr.push(i);
// 		}
// 		console.log(emptySqArr);
// 		let x = Math.floor(Math.random() * emptySqArr.length);
// 		console.log(x, emptySqArr[x]);
// 		let index = emptySqArr[x];
// 		arr[index] = "o";
// 		console.log(arr);
// 	},

// 	selectionAI(arr) {
// 		if (this.defenseAI(arr)) return this.defenseAI(arr);
// 		if (this.offenseAI(arr)) return this.offenseAI(arr);
// 		return this.randomAI(arr);
// 	},
// };
// // console.log(arr3);
// // playerAI.defenseAI(arr);
// // playerAI.offenseAI(arr);
// // playerAI.randomAI(arr3);

// // console.log(playerAI.selectionAI(test));
// console.log(checkWin(test));

// // console.log(winConditions(arr));
// // console.log(winConditions(arr2));
// // console.log(winConditions(arr3));
// // console.log(winConditions(test));
// // console.log(winConditions(arr5));

// // gameplay: functions for gameplay

// // gameboard: update board using those functions

// // const testArr = [1, 2, 3, 4];
// // testArr[1] = "x";
// // console.log(testArr);
// const checkDraw = (arr) => {
// 	// arr.forEach((el) => {
// 	// 	if (el) {
// 	// 		console.log("nope");
// 	// 		return false;
// 	// 	}
// 	// });
// 	for (let i = 0; i < arr.length; i++) {
// 		if (!arr[i]) return false;
// 	}
// 	return true;
// };

// console.log(checkDraw(arr5));
