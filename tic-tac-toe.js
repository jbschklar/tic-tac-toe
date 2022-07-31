"use strict";
const Player = (name, marker, active = true) => {
	const getName = () => name;
	const getMarker = () => marker;
	return { name, getName, getMarker, active };
};

// const displayController = (() => {
// 	const playerSelectBtn = document.querySelector(".player-select");
// 	const form = document.querySelector("form");
// 	const playerNameDisplay = document.querySelector(".player-name");
// 	const playerMarkerDisplay = document.querySelector(".player-marker");
// 	const winMessage = document.querySelector(".win-message");
// 	const endGame = () => {};
// 	playerSelectBtn.addEventListener("click", () => {
// 		form.classList.remove("hidden");
// 	});

// 	return { form, playerNameDisplay, playerMarkerDisplay, winMessage, endGame };
// })();

const gamePlay = (() => {
	const playerSelectBtn = document.querySelector(".player-select");
	const form = document.querySelector("form");
	const playerName = document.querySelector(".player-name");
	const playerMarker = document.querySelector(".player-marker");
	const winMessage = document.querySelector(".win-message");
	let player2;
	let player1;

	playerSelectBtn.addEventListener("click", () => {
		form.classList.remove("hidden");
	});

	form.addEventListener("submit", function (e) {
		e.preventDefault();
		const name = form.querySelector("#name").value;
		const marker = form.querySelector("input[name='marker']:checked").id;
		player1 = Player(name, marker);
		player2 = Player(
			"computer",
			player1.getMarker() === "X" ? "O" : "X",
			false
		);
		playerName.innerHTML = player1.getName();
		playerMarker.innerHTML = player1.getMarker();
		form.classList.add("hidden");
	});

	const checkWin = function (arr) {
		const horizontalWin = [1, 3];
		const verticalWin = [3, 1];
		const diagonalWinA = [4, 2];
		const diagonalWinB = [2, 2];

		const calcWin = function (arr, arrInc, setInc) {
			let win = false;
			for (let i = 0; i < setInc * 3; i += setInc) {
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

	// alternate between player and computer rounds with active key
	// const activePlayer = document.querySelector(".active");
	const toggleActive = (players) => {
		players.forEach((player) => {
			player.active = player.active ? false : true;
		});
	};
	const squareSelection = (square) => {
		console.log(player1, player2);
		const activePlayer = player1.active ? player1 : player2;
		console.log(activePlayer);
		if (!square.innerHTML) {
			// square.innerHTML = activePlayer.getMarker();
			gameBoard.gameBoard[square.dataset.num] = activePlayer.getMarker();
			gameBoard.renderBoard();
			toggleActive([player1, player2]);
		}
		if (square.innerHTML) console.log("taken");
		if (checkWin(gameBoard.gameBoard))
			winMessage.innerHTML = `${activePlayer.getName()} wins!`;
	};
	return { squareSelection };
})();

const gameBoard = (() => {
	const board = document.querySelector(".game-board");
	const squares = document.querySelectorAll(".square");
	const inputs = document.querySelectorAll(".square-input");
	let gameBoard = ["", "", "", "", "", "", "", "", ""];
	const renderBoard = () => {
		squares.forEach((square) => {
			square.innerHTML = gameBoard[square.dataset.num];
		});
	};
	squares.forEach((square) => {
		square.addEventListener("click", () => {
			gamePlay.squareSelection(square);
		});
	});
	return { squares, gameBoard, renderBoard };
})();

// const player1 = Player("Josh", "X");

// gamePlay.toggleActive(player1);
// console.log(player1);

// 1) player selects name and chooses X's or O's and the player object is created/ display is updated with this information and then the input disabled during game play.
// 2) game play is initiated.
// 3) during game play, input is alternating between player and comp. When player clicks on a square, it is filled in with the player marker. Then the computer auto fills a square.
// 4) the computer chooses where to place a marker based on overall board and where there is an opening between player selected squares to block or win if able between it's own squares.
// 5) each time a square is selected by either player or computer, it is updated using the gameBoard module function.

// const arr = ["", "x", "o", "o", "x", "", "", "x", ""];
// const arr2 = ["a", "b", "c", "d", "b", "c", "e", "b", "c"];
// const arr3 = ["X", "O", "", "X", "O", "X", "", "O", ""];
// const arr4 = ["a", 1, "a", 3, "a", 5, "a", 7, 8];
// const arr5 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// const test = ["O", "X", "", "", "X", "O", "", "X", ""];

// console.log(calcWin(arr4, 1, 3));
// const winConditions = function (arr) {
// 	const calcWin = function (arr, arrInc, setInc) {
// 		let win = false;
// 		for (let i = 0; i < setInc * 3; i += setInc) {
// 			const a = arr[i];
// 			const b = arr[i + arrInc];
// 			const c = arr[i + arrInc * 2];
// 			// if (!a || !b || !c) {
// 			// 	console.log({ a, b, c });
// 			// 	return;
// 			// }
// 			let win = a === b && a === c ? true : false;
// 			if (win && a && b && c) return win;
// 		}
// 		return win;
// 	};
// 	const horizontalWin = [1, 3];
// 	const verticalWin = [3, 1];
// 	const diagonalWinA = [4, 2];
// 	const diagonalWinB = [2, 2];

// 	if (calcWin(arr, ...horizontalWin)) return true;
// 	if (calcWin(arr, ...verticalWin)) return true;
// 	if (calcWin(arr, ...diagonalWinA)) return true;
// 	if (calcWin(arr, ...diagonalWinB)) return true;
// 	return false;
// };

// console.log(winConditions(arr));
// console.log(winConditions(arr2));
// console.log(winConditions(arr3));
// console.log(winConditions(test));
// console.log(winConditions(arr5));

// gameplay: functions for gameplay

// gameboard: update board using those functions
