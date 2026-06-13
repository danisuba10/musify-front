import React, { useContext, useState, useEffect } from "react";

import Add from "../../../assets/add.svg?react";
import Play from "../../../assets/play.svg?react";
import SaveButton from "../../AdminPanel/SaveButton";
import DeleteButton from "../../AdminPanel/DeleteButton";
import ModifyButton from "../../AdminPanel/ModifyButton";

import "../../../styles/details/ProfileDetail/ProfileActionBar.css";
import { AuthContext } from "../../auth/AuthProvider";
import { toggleLibraryItem } from "../../Service/LibraryService";
import { apiURL } from "../../../assets/Constants";
import "../../../styles/details/LibraryToggleButton.css";

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
  const { userToken, getUserId, isAdmin, isAuthenticated } = useContext(AuthContext);
  const [inLibrary, setInLibrary] = useState(false);
  const [toggling, setToggling] = useState(false);

  const self = () => {
    return getUserId() === userId;
  };
  const [following, setFollowing] = useState(false);

  const followButtonClick = () => {
    setFollowing(!following);
  };

  // Check initial library state for artists
  useEffect(() => {
    if (!isAuthenticated || !userId || type !== "Artist") return;
    const checkState = async () => {
      try {
        const res = await fetch(`${apiURL}/library/check?itemId=${userId}&itemType=Artist`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setInLibrary(data.inLibrary);
        }
      } catch {}
    };
    checkState();
  }, [userId, type, isAuthenticated, userToken]);

  const handleToggle = async () => {
    if (!isAuthenticated || toggling || !userId) return;
    setToggling(true);
    try {
      const result = await toggleLibraryItem({ userToken, itemId: userId, itemType: "Artist" });
      setInLibrary(result.added);
      window.dispatchEvent(new CustomEvent("library-changed"));
    } catch (err) {
      console.error("Toggle library failed", err);
    } finally {
      setToggling(false);
    }
  };

  return (
    <>
      <div
        className="profile-detail-action-bar"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${middleColor}, ${topColor})`,
        }}
      >
        <div className="flex flex-row gap-4 items-center h-full">
          {isModify && hasModifyPermission() && (
            <SaveButton onClickFunc={onSave} />
          )}
          {isModify && hasModifyPermission() && type === "Artist" && (
            <DeleteButton onClickFunc={onDelete} />
          )}
          {hasModifyPermission() && <ModifyButton onClickFunc={switchModify} />}
          {isAuthenticated && type === "Artist" && (
            <button
              className="library-toggle-button"
              onClick={handleToggle}
              disabled={toggling}
              title={inLibrary ? "Remove from Library" : "Save to Library"}
            >
              {inLibrary ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              )}
            </button>
          )}
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
