import { GameState } from "../game-state";
import "./game-ui.scss";
import React from "react";

interface GameUIProps {
  gameState: GameState;
}

export const GameUI: React.FC<GameUIProps> = ({ gameState }) => {
  return (
    <div className="interface">
      <button onClick={() => gameState.requestAnimation("waving")}>Wave</button>
      <button onClick={() => gameState.requestAnimation("salute")}>
        Salute
      </button>
      <button onClick={() => gameState.requestAnimation("idle")}>Idle</button>
      <button onClick={() => gameState.requestAnimation("walking")}>
        Walk
      </button>
    </div>
  );
};
