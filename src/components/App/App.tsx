import React, {useEffect, useState} from 'react';
import './App.css';
import {GameState, subscribeToGameChanges, unsubscribeFromGameChanges} from "../../gameLogic";
import Game from "../Game/Game";

// connect to server, see if game is currently happening
// if so, render game
// else, ask for name and start new game

function useGameState(): GameState {
  const [gameState, setGameState] = useState<GameState>(null);
  useEffect(() => {
    const subscriptionId = subscribeToGameChanges((newState: GameState) => {
      setGameState(newState);
    });
    return () => {
      unsubscribeFromGameChanges(subscriptionId);
    }
  });
  return gameState;
}

function App() {
  const gameState = useGameState();
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
