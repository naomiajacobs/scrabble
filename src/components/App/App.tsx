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
  let content: JSX.Element | string;
  switch (gameState) {
    case null:
      content = 'initializing...';
      break;
    case 'no game':
      content = 'start new game';
      break;
    case 'too late':
      content = 'A game is already in progress. Try again later';
      break;
    default:
      content = <Game gameState={gameState} />;

  }
  return (
    <div className="App">
      <h1>scrabble app</h1>
      <div>
        {content}
      </div>
    </div>
  );
}

export default App;
