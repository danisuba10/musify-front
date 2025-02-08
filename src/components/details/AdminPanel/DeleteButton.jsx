import React from "react";
import "../../../styles/adminpanel/DeleteButton.css";
import DeleteSVG from "../../../assets/delete.svg?react";

const DeleteButton = ({ onClickFunc }) => {
  return (
    <button className="delete-button-container" onClick={onClickFunc}>
      <DeleteSVG className="delete-button" />
    </button>
  );
};

export default DeleteButton;
