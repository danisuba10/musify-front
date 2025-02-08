import React from "react";
import "../../../styles/adminpanel/DeleteButton.css";
import DeleteSVG from "../../../assets/delete.svg?react";

const DeleteButton = ({ onClickFunc }) => {
  return (
    <button className="play-button-container" onClick={onClickFunc}>
      <DeleteSVG className="play-button" />
    </button>
  );
};

export default DeleteButton;
