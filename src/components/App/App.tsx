import React, {useEffect, useState} from "react";
import "./App.css";
import Game from "../Game/Game";
import {CurrentGameStatus, defaultServerStatus, ServerStatus} from "../../Constants";
import {subscribeToServer, unsubscribeFromServer} from "../../subscriptions";

function useServerStatus(): ServerStatus {
  const [serverStatus, setServerStatus] = useState<ServerStatus>(defaultServerStatus);
  useEffect(() => {
    const subscriptionId = subscribeToServer(
      (newStatus: ServerStatus) => {
        setServerStatus(newStatus);
        console.log(newStatus);
      }
    );
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
    case CurrentGameStatus.WAITING_ON_OPPONENT:
      content = 'waiting for opponent to join';
      break;
    case CurrentGameStatus.FULL:
      content = 'A game is already in progress. Try again later';
      break;
    case CurrentGameStatus.FINISHED:
      content = 'done!';
      break;
    case CurrentGameStatus.IN_PROGRESS:
      content = <Game gameState={serverStatus.gameState} />;
      break;
    default:
      content = `Unknown server response: ${serverStatus}`
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
