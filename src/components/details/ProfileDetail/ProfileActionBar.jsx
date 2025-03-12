import React, { useContext, useState } from "react";

import Add from "../../../assets/add.svg?react";
import Play from "../../../assets/play.svg?react";
import SaveButton from "../../AdminPanel/SaveButton";
import DeleteButton from "../../AdminPanel/DeleteButton";
import ModifyButton from "../../AdminPanel/ModifyButton";

import "../../../styles/details/ProfileDetail/ProfileActionBar.css";
import { AuthContext } from "../../auth/AuthProvider";

const ProfileActionBar = ({
  userId,
  middleColor,
  topColor,
  isModify,
  onSave,
  onDelete,
  hasModifyPermission,
  switchModify,
  type,
}) => {
  console.log("ProfileActionBar ismodify", isModify);
  const { userToken, getUserId, isAdmin } = useContext(AuthContext);

  const self = () => {
    return getUserId() === userId;
  };
  const [following, setFollowing] = useState(false);

  const followButtonClick = () => {
    setFollowing(!following);
  };

  return (
    <>
      <div
        className="profile-detail-action-bar"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${middleColor}, ${topColor})`,
        }}
      >
        <div className="flex flex-row gap-4">
          {isModify && (
            <SaveButton className="square-button" onClickFunc={onSave} />
          )}
          {type === "Artist" && (
            <DeleteButton className="square-button" onClickFunc={onDelete} />
          )}
          {hasModifyPermission() && <ModifyButton onClickFunc={switchModify} />}
        </div>
        {!self() && !isModify && userToken && (
          <button
            className="follow-button-container"
            onClick={followButtonClick}
          >
            <div className="follow-button">
              {following ? "Following" : "Follow"}
            </div>
          </button>
        )}
      </div>
    </>
  );
};

export default ProfileActionBar;
