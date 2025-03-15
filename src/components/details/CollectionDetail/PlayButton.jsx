import React from "react";
import "../../../styles/details/PlayButton.css";
import Play from "../../../assets/play.svg?react";

const PlayButton = ({ onClickFunc }) => {
  return (
    <button className="play-button-container" onClick={onClickFunc}>
      <Play className="play-button" />
    </button>
  );
};

export default PlayButton;
