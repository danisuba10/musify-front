import React from "react";
import "../../../styles/details/PlayButton.css";
import Play from "../../../assets/play.svg?react";

const PlayButton = () => {
  return (
    <button className="play-button-container">
      <Play className="play-button" />
    </button>
  );
};

export default PlayButton;
