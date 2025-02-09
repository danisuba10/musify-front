import React from "react";
import "../../styles/adminpanel/SaveButton.css";
import SaveSVG from "../../assets/save.svg?react";

const SaveButton = ({ onClickFunc }) => {
  return (
    <button className="save-button-container" onClick={onClickFunc}>
      <SaveSVG className="save-button" />
    </button>
  );
};

export default SaveButton;
