"use strict";
const Player = (name, marker, active = true) => {
	const getName = () => name;
	const getMarker = () => marker;
	return { name, getName, getMarker, active };
};

const gameAI = (() => {})();

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
		player2 = Player(
			"computer",
			player1.getMarker() === "X" ? "O" : "X",
			false
		);
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
			let inc = setInc === 2 ? setInc : setInc * 3;
			for (let i = 0; i < inc; i += setInc) {
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
		if (!gameActive || square.innerHTML) return;

		const activePlayer = player1.active ? player1 : player2;

		if (!square.innerHTML) {
			gameBoardDisplay.boardArr[square.dataset.num] = activePlayer.getMarker();
			gameBoardDisplay.renderBoard();
			toggleActive([player1, player2]);
		}

		if (checkWin(gameBoardDisplay.boardArr)) {
			winMessage.innerHTML = `${activePlayer.getName()} wins!`;
			gameActive = false;
		}
	};
	return { squareSelection };
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

const arr = ["", "", "", "", "", "", "", "", ""];
const arr2 = ["x", "", "x", "", "", "", "o", "", "o"];
const arr3 = ["X", "O", "", "X", "O", "X", "", "O", ""];
const arr4 = ["a", 1, "a", 3, "a", 5, "a", 7, 8];
const arr5 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const test = ["O", "X", "", "", "X", "O", "", "X", ""];

const squares = document.querySelectorAll(".square");

// console.log(calcWin(arr4, 1, 3));
const checkWin = function (arr) {
	const horizontalWin = [1, 3];
	const verticalWin = [3, 1];
	const diagonalWinA = [4, 2];
	const diagonalWinB = [2, 2];

	const calcWin = function (arr, arrInc, setInc) {
		let win = false;
		let inc = setInc === 2 ? setInc : setInc * 3;
		for (let i = 0; i < inc; i += setInc) {
			const a = arr[i];
			const b = arr[i + arrInc];
			const c = arr[i + arrInc * 2];

			let win = a === b && a === c ? true : false;
			if (win && a && b && c) {
				console.log(a);
				return win;
			}
		}
		return win;
	};

	if (calcWin(arr, ...horizontalWin)) return true;
	if (calcWin(arr, ...verticalWin)) return true;
	if (calcWin(arr, ...diagonalWinA)) {
		console.log("diagonalWinA");
		return true;
	}
	if (calcWin(arr, ...diagonalWinB)) {
		console.log("diagonalWinA");
		return true;
	}
	return false;
};

const playerAI = {
	marker: "o",
};
let newArr = [];
console.log(checkWin(arr5));
const AI = function () {
	for (let i = 0; i < arr2.length; i++) {
		if (arr2[i] === "") {
			arr2[i] = "o";
			if (!checkWin(arr2)) {
				arr2[i] = "";
				console.log(arr2, i);
				continue;
			}
			if (checkWin(arr2)) {
				console.log("win", i);
				newArr = arr2.slice(0);
				console.log(newArr);
				return;
			}
		}
	}
};

console.log(arr2);
AI();
// console.log(winConditions(arr));
// console.log(winConditions(arr2));
// console.log(winConditions(arr3));
// console.log(winConditions(test));
// console.log(winConditions(arr5));

// gameplay: functions for gameplay

// gameboard: update board using those functions
