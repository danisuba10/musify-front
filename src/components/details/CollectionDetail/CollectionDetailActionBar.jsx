import React from "react";

import Add from "../../../assets/add.svg?react";
import Play from "../../../assets/play.svg?react";

import "../../../styles/details/ColelctionDetailActionBar.css";

const CollectionDetailActionBar = ({ middleColor, topColor }) => {
  return (
    <>
      <div
        className="collection-detail-action-bar"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${middleColor}, ${topColor})`,
        }}
      >
        <button className="play-button-container">
          <Play className="play-button" />
        </button>
        <button className="add-button-container">
          <Add className="add-button" />
        </button>
      </div>
    </>
  );
};

export default CollectionDetailActionBar;
