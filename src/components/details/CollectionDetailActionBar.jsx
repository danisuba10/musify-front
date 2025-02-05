import React from "react";

import Add from "../../assets/add.svg?react";
import Play from "../../assets/play.svg?react";

import "../../styles/details/ColelctionDetailActionBar.css";

const CollectionDetailActionBar = () => {
  return (
    <>
      <div className="collection-detail-action-bar">
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
