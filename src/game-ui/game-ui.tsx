import { GameState } from "../game-state";
import "./game-ui.scss";
import React from "react";

interface GameUIProps {
  gameState: GameState;
}

export const GameUI: React.FC<GameUIProps> = ({ gameState }) => {
  return (
    <div className="interface">
      <button
        onClick={() => {
          console.log("test ");
        }}
      >
        Test
      </button>
    </div>
  );
};
