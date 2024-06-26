import "./app.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { AppState } from "./app-state";
import { LoadingScreen } from "./loading-screen/loading-screen";
import { GameUI } from "./game-ui/game-ui";

interface AppProps {
  appState: AppState;
}

export const App: React.FC<AppProps> = observer(({ appState }) => {
  return (
    <div className="app">
      <canvas id="canvas"></canvas>

      {appState.gameLoader.loading && <LoadingScreen />}
      {appState.gameState && <GameUI gameState={appState.gameState} />}
    </div>
  );
});
