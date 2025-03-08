import React from "react";
import "../../styles/adminpanel/SaveButton.css";
import ModifySVG from "../../assets/edit.svg?react";

const SaveButton = ({ onClickFunc }) => {
  return (
    <button className="save-button-container" onClick={onClickFunc}>
      <ModifySVG className="save-button" />
    </button>
  );
};

export default SaveButton;
