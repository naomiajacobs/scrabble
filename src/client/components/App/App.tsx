import React, { useEffect, useState } from "react";
import "./App.css";
import Game from "../Game/Game";
import {
  CurrentGameStatus,
  defaultServerStatus,
  ServerStatus,
} from "../../Constants";
import { subscribeToServer, unsubscribeFromServer } from "../../subscriptions";

function useServerStatus(): ServerStatus {
  const [serverStatus, setServerStatus] = useState<ServerStatus>(
    defaultServerStatus
  );
  useEffect(() => {
    const subscriptionId = subscribeToServer((newStatus: ServerStatus) => {
      setServerStatus(newStatus);
      console.log("New status from backend: ", newStatus);
    });
    return () => {
      unsubscribeFromServer(subscriptionId);
    };
  });
  return serverStatus;
}

function App() {
  const serverStatus = useServerStatus();
  let content: JSX.Element | string;
  switch (serverStatus.currentGameStatus) {
    case CurrentGameStatus.INTRUDER:
      content = "Who the hell are you?";
      break;
    case CurrentGameStatus.GAME_OVER:
      content = <Game gameState={serverStatus.gameState} gameOver={true} />;
      break;
    case CurrentGameStatus.IN_PROGRESS:
      content = <Game gameState={serverStatus.gameState} gameOver={false} />;
      break;
    default:
      content = `Unknown server response: ${serverStatus}`;
  }
  return (
    <div className="App">
      <div>{content}</div>
    </div>
  );
}

export default App;
