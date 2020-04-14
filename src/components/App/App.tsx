import React, { useEffect, useState } from "react";
import "./App.css";
import {
  IndeterminateGameState,
  subscribeToGameChanges,
  unsubscribeFromGameChanges,
} from "../../gameLogic";
import Game from "../Game/Game";

function useGameState(): IndeterminateGameState {
  const [gameState, setGameState] = useState<IndeterminateGameState>(null);
  useEffect(() => {
    const subscriptionId = subscribeToGameChanges(
      (newState: IndeterminateGameState) => {
        setGameState(newState);
        console.log(newState);
      }
    );
    return () => {
      unsubscribeFromGameChanges(subscriptionId);
    };
  });
  return gameState;
}

function App() {
  const gameState = useGameState();
  return (
    <div className="App">
      <h1>scrabble app</h1>
      <div>
        {gameState == null ? (
          "initializing..."
        ) : gameState === "no game" ? (
          "start new game"
        ) : (
          <Game gameState={gameState} />
        )}
      </div>
    </div>
  );
}

export default App;
