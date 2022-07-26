"use strict";
const gameBoard = (() => {
	const board = document.querySelector(".game-board");
	const squares = document.querySelectorAll(".square");
	let gameBoard = ["X", "O", "X", "O", "X", "O", "X", "X", "O"];
	const renderBoard = (() => {
		squares.forEach((square) => {
			square.innerHTML = gameBoard[square.dataset.num];
		});
	})();
	const updateBoard = (() => {
		board.addEventListener("click", (e) => {
			console.log(e);
		});
	})();
	return { gameBoard, updateBoard };
})();

const displayController = (() => {})();

const Player = (name, marker) => {
	const getName = () => name;
	const getMarker = () => marker;
	return { getName, getMarker };
};
