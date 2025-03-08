import React, { useContext, useState } from "react";

import Add from "../../../assets/add.svg?react";
import PlayButton from "./PlayButton";
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
}) => {
  const { userToken, isAdmin } = useContext(AuthContext);
  const [isModify, setIsModify] = useState(initialIsModify);

  const switchModify = () => {
    console.log("Modify switch!");
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
              <DeleteButton className="add-button" onClickFunc={toDelete} />
            )}
            <SaveButton className="add-button" onClickFunc={toSave} />
          </>
        )}
        {!isModify && (
          <>
            <div className="add-button-container">
              <PlayButton />
            </div>
          </>
        )}
        {hasModifyPermission() && <ModifyButton onClickFunc={switchModify} />}
      </div>
    </>
  );
};

export default CollectionDetailActionBar;
