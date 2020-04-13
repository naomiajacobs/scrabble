import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App, {AppProps} from './App';
import * as serviceWorker from './serviceWorker';
import {GameState, getGameState, subscribeToGameChanges} from "./gameLogic";



function render(props: AppProps) {
    ReactDOM.render(
  <React.StrictMode>
    <App gameState={props.gameState}/>
  </React.StrictMode>,
  document.getElementById('root')
);
}

subscribeToGameChanges((gameState: GameState) => {
    render({gameState});
});
render({gameState: getGameState()});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
