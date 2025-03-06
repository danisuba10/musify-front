import React from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { apiURL } from "../../../assets/Constants";
import "../../../styles/details/MoreOptions/MoreOptions.css";

export const MoreOptionsButton = ({ songId, songName, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="more-options-button flex items-center justify-center
      text-svgGrey hover:text-white"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="5" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
      </svg>
    </button>
  );
};
