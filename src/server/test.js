const { LETTER, PLAY, MERT, NAOMI } = require("./constants");
const { startNewGame } = require("./gameLogic.js");

/*
const test = require('./src/server/test');
test();
 */

function test() {
  const firstMove = {
    type: PLAY,
    lettersPlaced: [
      [LETTER.F, [7, 7], null],
      [LETTER.I, [7, 8], null],
      [LETTER.BLANK, [7, 9], LETTER.R],
      [LETTER.S, [7, 10], null],
      [LETTER.T, [7, 11], null],
    ],
  };
  const singleLetterValidMove = {
    type: PLAY,
    lettersPlaced: [[LETTER.I, [6, 7], null]],
  };
  const invalidCoordsMove = {
    type: "PLAY",
    lettersPlaced: [["A", [0, 24], null]],
  };
  const letterAlreadyThereMove = {
    type: "PLAY",
    lettersPlaced: [["A", [7, 7], null]],
  };
  const nonContinuousMove = {
    type: "PLAY",
    lettersPlaced: [
      ["A", [0, 0], null],
      ["A", [0, 3], null],
    ],
  };
  const continuousMove = {
    type: "PLAY",
    lettersPlaced: [
      ["E", [8, 6], null],
      ["G", [8, 5], null],
      ["E", [8, 7], null],
    ],
  };
  const nonConnectedMove = {
    type: "PLAY",
    lettersPlaced: [["A", [0, 0], null]],
  };
  const oneDirectionMove = {
    type: "PLAY",
    lettersPlaced: [
      ["E", [6, 10], null],
      ["I", [5, 10], null],
      ["T", [4, 10], null],
    ],
  };
  const game = startNewGame();
  const makeMove = (move) => {
    game.makeMove({ ...move, playerName: game.gameState.activePlayer });
  };
  console.log("Valid moves:");
  makeMove(firstMove);
  makeMove(singleLetterValidMove);
  makeMove(continuousMove);
  makeMove(oneDirectionMove);

  console.log("Invalid moves:");
  makeMove(invalidCoordsMove);
  makeMove(letterAlreadyThereMove);
  makeMove(nonContinuousMove);
  makeMove(nonConnectedMove);
}

module.exports = test;
