"use strict";
const Player = (name, marker) => {
	const getName = () => name;
	const getMarker = () => marker;
	return { name, getName, getMarker };
};

const GameAI = (marker) => {
	const getMarker = () => marker;
	const defenseAI = function (arr) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] === "") {
				arr[i] = marker === "O" ? "X" : "O";
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
		return arr;
	};

	const selectionAI = function (arr) {
		if (offenseAI(arr)) return;
		if (defenseAI(arr)) return;
		return randomAI(arr);
	};
	return { selectionAI, getMarker };
};

const gameBoardDisplay = (() => {
	const playerSelectBtn = document.querySelector(".player-select");
	const form = document.querySelector("form");
	const squares = document.querySelectorAll(".square");
	const resetBtn = document.querySelector(".reset-btn");
	let boardArr = ["", "", "", "", "", "", "", "", ""];
	const renderBoard = () => {
		squares.forEach((square) => {
			square.innerHTML = boardArr[square.dataset.num];
		});
	};

	playerSelectBtn.addEventListener("click", (e) => {
		form.classList.remove("hidden");
		gamePlay.init(e);
	});

	resetBtn.addEventListener("click", (e) => {
		console.log("init");
		gamePlay.init(e);
	});
	squares.forEach((square) => {
		square.addEventListener("click", () => {
			console.log("click");
			gamePlay.squareSelection(square);
		});
	});
	return { boardArr, renderBoard, form };
})();

const gamePlay = (() => {
	const form = gameBoardDisplay.form;
	const playerName = document.querySelector(".player-name");
	const playerMarker = document.querySelector(".player-marker");
	const winMessage = document.querySelector(".win-message");
	let player2;
	let player1;
	let gameActive = false;

	const init = (e) => {
		winMessage.innerHTML = "";
		console.log(e.target);
		if (e.target.classList.contains("player-select")) {
			console.log("player select");
			playerName.innerHTML = "";
			playerMarker.innerHTML = "";
		}

		gameBoardDisplay.boardArr.forEach((el) => {
			gameBoardDisplay.boardArr.splice(
				gameBoardDisplay.boardArr.indexOf(el),
				1,
				""
			);
		});
		gameBoardDisplay.renderBoard(gameBoardDisplay.boardArr);
		gameActive = true;
	};

	form.addEventListener("submit", function (e) {
		e.preventDefault();
		const name = form.querySelector("#name").value;
		const marker = form.querySelector("input[name='marker']:checked").id;
		player1 = Player(name, marker);
		player2 = GameAI(player1.getMarker() === "X" ? "O" : "X");
		playerName.innerHTML = `Player: ${player1.getName()}`;
		playerMarker.innerHTML = `${player1.getMarker()}`;
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
			let inc = setInc === 2 ? 3 : setInc * 3;
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

	const squareSelection = (square) => {
		if (!gameActive || square.innerHTML) return;

		if (!square.innerHTML) {
			gameBoardDisplay.boardArr[square.dataset.num] = player1.getMarker();
			gameBoardDisplay.renderBoard();
			if (checkWin(gameBoardDisplay.boardArr)) {
				winMessage.innerHTML = `🤘 ${player1.getName()} wins!`;
				gameActive = false;
				return;
			}

			player2.selectionAI(gameBoardDisplay.boardArr);
			gameBoardDisplay.renderBoard();
			if (checkWin(gameBoardDisplay.boardArr)) {
				winMessage.innerHTML = `Computer wins 🤬`;
				gameActive = false;
				return;
			}

			if (checkDraw(gameBoardDisplay.boardArr)) {
				winMessage.innerHTML = `Draw`;
				return;
			}
		}
	};

	return { squareSelection, checkWin, init, gameActive };
})();
