import React, { useContext } from "react";

import Add from "../../../assets/add.svg?react";
import PlayButton from "./PlayButton";
import EditButton from "../../../assets/edit.svg?react";
import "../../../styles/details/CollectionDetailActionBar.css";
import DeleteButton from "../../AdminPanel/DeleteButton";
import { AuthContext } from "../../auth/AuthProvider";
import SaveButton from "../../AdminPanel/SaveButton";

const CollectionDetailActionBar = ({
  middleColor,
  topColor,
  isModify,
  toDelete,
  isAdd,
  toSave,
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
            {!isAdd && (
              <div className="add-button-container">
                <DeleteButton className="add-button" onClickFunc={toDelete} />
              </div>
            )}
            {isModify && (
              <SaveButton className="add-button" onClickFunc={toSave} />
            )}
          </>
        )}
        {!isModify && (
          <>
            <button className="add-button-container">
              <PlayButton />
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default CollectionDetailActionBar;
