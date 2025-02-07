import React from "react";

import Add from "../../../assets/add.svg?react";
import PlayButton from "./PlayButton";
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
        <PlayButton />
        <button className="add-button-container">
          <Add className="add-button" />
        </button>
      </div>
    </>
  );
};

export default CollectionDetailActionBar;
