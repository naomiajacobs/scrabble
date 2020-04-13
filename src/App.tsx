import React from 'react';
import './App.css';
import {GameState} from "./gameLogic";

// connect to server, see if game is currently happening
// if so, render game
// else, ask for name and start new game

function Game() {
    return <div>Let's play!</div>
}
export interface AppProps {
    gameState: GameState;
}
function App({gameState}: AppProps) {
  return (
    <div className="App">
      <h1>scrabble app</h1>
        <div>
            {gameState == null ? 'initializing...' : <Game />}
        </div>
    </div>
  );
}

export default App;
