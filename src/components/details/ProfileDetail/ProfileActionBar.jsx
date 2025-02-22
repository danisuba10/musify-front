import React, { useContext, useState } from "react";

import Add from "../../../assets/add.svg?react";
import Play from "../../../assets/play.svg?react";
import SaveButton from "../../AdminPanel/SaveButton";
import DeleteButton from "../../AdminPanel/DeleteButton";

import "../../../styles/details/ProfileDetail/ProfileActionBar.css";
import { AuthContext } from "../../auth/AuthProvider";

const ProfileActionBar = ({
  middleColor,
  topColor,
  isModify,
  onSave,
  onDelete,
}) => {
  const { userToken } = useContext(AuthContext);

  const [self, setSelf] = useState(false);
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
        {isModify && (
          <div className="flex flex-row gap-4">
            <SaveButton className="square-button" onClickFunc={onSave} />
            <DeleteButton className="square-button" onClickFunc={onDelete} />
          </div>
        )}
        {!self && !isModify && userToken && (
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
