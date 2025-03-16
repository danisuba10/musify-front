import React, { useContext, useState } from "react";

import Add from "../../../assets/add.svg?react";
import PlayButton from "./PlayButton";
import PlayQueueButton from "./PlayQueueButton";
import EditButton from "../../../assets/edit.svg?react";
import "../../../styles/details/CollectionDetailActionBar.css";
import DeleteButton from "../../AdminPanel/DeleteButton";
import ModifyButton from "../../AdminPanel/ModifyButton";
import { AuthContext } from "../../auth/AuthProvider";
import SaveButton from "../../AdminPanel/SaveButton";

const CollectionDetailActionBar = ({
  middleColor,
  topColor,
  isModify: initialIsModify,
  toDelete,
  isAdd,
  toSave,
  switchParentIsModify,
  hasModifyPermission,
  playAlbum,
  addToQueueAlbum,
}) => {
  const { userToken, isAdmin } = useContext(AuthContext);
  const [isModify, setIsModify] = useState(initialIsModify);

  const switchModify = () => {
    setIsModify(!isModify);
    if (switchParentIsModify) {
      switchParentIsModify();
    }
  };

  return (
    <>
      <div
        className="collection-detail-action-bar"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${middleColor}, ${topColor})`,
        }}
      >
        {hasModifyPermission() && isModify && (
          <>
            {!isAdd && (
              <DeleteButton
                className="add-button"
                onClickFunc={toDelete}
                title="Delete this item"
              />
            )}
            <SaveButton
              className="add-button"
              onClickFunc={toSave}
              title="Save changes"
            />
          </>
        )}
        {!isModify && (
          <>
            <div className="add-button-container" title="Play album">
              <PlayButton onClickFunc={playAlbum} />
            </div>
            <div className="add-button-container" title="Add album to queue">
              <PlayQueueButton onClickFunc={addToQueueAlbum} />
            </div>
          </>
        )}
        {hasModifyPermission() && (
          <ModifyButton
            onClickFunc={switchModify}
            title="Modify this collection"
          />
        )}
      </div>
    </>
  );
};

export default CollectionDetailActionBar;
