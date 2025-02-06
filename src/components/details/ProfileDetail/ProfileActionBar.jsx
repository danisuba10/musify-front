import React, { useState } from "react";

import Add from "../../../assets/add.svg?react";
import Play from "../../../assets/play.svg?react";

import "../../../styles/details/ProfileDetail/ProfileActionBar.css";

const ProfileActionBar = ({ middleColor, topColor }) => {
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
        {!self && (
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
