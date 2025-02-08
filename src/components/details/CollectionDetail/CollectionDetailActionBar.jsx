import React, { useContext } from "react";

import Add from "../../../assets/add.svg?react";
import PlayButton from "./PlayButton";
import EditButton from "../../../assets/edit.svg?react";
import "../../../styles/details/CollectionDetailActionBar.css";
import DeleteButton from "../AdminPanel/DeleteButton";
import { AuthContext } from "../../auth/AuthProvider";

const CollectionDetailActionBar = ({
  middleColor,
  topColor,
  isModify,
  toDelete,
}) => {
  const { isAdmin } = useContext(AuthContext);

  return (
    <>
      <div
        className="collection-detail-action-bar"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${middleColor}, ${topColor})`,
        }}
      >
        {isModify && (
          <>
            <div className="add-button-container">
              <DeleteButton className="add-button" onClickFunc={toDelete} />
            </div>
          </>
        )}
        {!isModify && (
          <>
            <button className="add-button-container">
              <PlayButton />
            </button>
            <button className="add-button-container">
              <Add className="add-button" />
            </button>
            {isAdmin && (
              <button className="add-button-container">
                <EditButton className="add-button" />
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CollectionDetailActionBar;
