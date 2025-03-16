import React from "react";
import "../../../styles/details/PlayButton.css";
import Play from "../../../assets/play_q.svg?react";

const PlayQueueButton = ({ onClickFunc }) => {
  return (
    <button className="play-button-container" onClick={onClickFunc}>
      <Play className="play-button" />
    </button>
  );
};

export default PlayQueueButton;
