"use strict";
const Player = (name, marker, active = true) => {
	const getName = () => name;
	const getMarker = () => marker;
	return { name, getName, getMarker, active };
};

const gameBoard = (() => {
	const board = document.querySelector(".game-board");
	const squares = document.querySelectorAll(".square");
	const inputs = document.querySelectorAll(".square-input");
	let gameBoard = ["", "O", "", "O", "", "O", "", "", "O"];
	const renderBoard = (() => {
		squares.forEach((square) => {
			square.innerHTML = gameBoard[square.dataset.num];
		});
	})();
	const updateBoard = () => {};
	return { squares, gameBoard, updateBoard };
})();

const displayController = (() => {
	const playerSelectBtn = document.querySelector(".player-select");
	const form = document.querySelector("form");
	const playerNameDisplay = document.querySelector(".player-name");
	const playerMarkerDisplay = document.querySelector(".player-marker");
	playerSelectBtn.addEventListener("click", () => {
		form.classList.remove("hidden");
	});
	return { form, playerNameDisplay, playerMarkerDisplay };
})();

const gamePlay = (() => {
	const form = displayController.form;
	const playerName = displayController.playerNameDisplay;
	const playerMarker = displayController.playerMarkerDisplay;
	let player2;
	let player1;

	// const evalWin = (arr) => {
	// 	if (
	// 		(arr[0] === arr[1] && arr[0] === arr[2]) ||
	// 		(arr[3] === arr[4] && arr[3] === arr[5]) ||
	//         (arr[6] === arr[7] && arr[6] === arr[8]) ||
	//         (arr[0] === arr[3] && arr[0] === arr[6]) ||
	//         (arr[1] === arr[4] && arr[1] === arr[7]) ||
	//         (arr[2] === arr[5] && arr[2] === )
	// 	)
	// 		win = true;
	// };

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
	// alternate between player and computer rounds with active key
	// const activePlayer = document.querySelector(".active");
	const toggleActive = (players) => {
		players.forEach((player) => {
			player.active = player.active ? false : true;
		});
	};
	const selection = (() => {
		gameBoard.squares.forEach((square) => {
			square.addEventListener("click", (e) => {
				const activePlayer = player1.active ? player1 : player2;
				console.log(activePlayer);
				if (!square.innerHTML) {
					square.innerHTML = activePlayer.getMarker();
					gameBoard.gameBoard[square.dataset.num] = activePlayer.getMarker();
					toggleActive([player1, player2]);
				}
				if (square.innerHTML) console.log("taken");
			});
		});
	})();
	return { selection, toggleActive };
})();

// const player1 = Player("Josh", "X");

// gamePlay.toggleActive(player1);
// console.log(player1);

// 1) player selects name and chooses X's or O's and the player object is created/ display is updated with this information and then the input disabled during game play.
// 2) game play is initiated.
// 3) during game play, input is alternating between player and comp. When player clicks on a square, it is filled in with the player marker. Then the computer auto fills a square.
// 4) the computer chooses where to place a marker based on overall board and where there is an opening between player selected squares to block or win if able between it's own squares.
// 5) each time a square is selected by either player or computer, it is updated using the gameBoard module function.
const calcWin = function (arr, arrInc, setInc) {
	let win = false;
	for (let i = 0; i < setInc * 3; i += setInc) {
		// console.log(i);
		let win =
			arr[i] === arr[i + arrInc] && arr[i] === arr[i + arrInc * 2]
				? true
				: false;
		if (win) return win;
	}
	return win;
};

const arr = ["a", "b", "c", "a", "c", "d", "a", "f", "g"];
const arr2 = ["a", "b", "c", "d", "b", "d", "e", "b", "g"];
const arr3 = ["a", "b", "c", "d", "e", "c", "g", "g", "c"];
const arr4 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

console.log(calcWin(arr, 3, 1));
console.log(calcWin(arr2, 3, 1));
console.log(calcWin(arr3, 3, 1));
// console.log(calcWin(arr4, 1, 3));
const horizontalWin = [1, 3];
const verticalWin = [3, 1];
const diagonalWin = [4, 2];
