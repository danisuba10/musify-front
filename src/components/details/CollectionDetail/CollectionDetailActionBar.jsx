import React, { useContext, useState, useEffect } from "react";

import Add from "../../../assets/add.svg?react";
import PlayButton from "./PlayButton";
import PlayQueueButton from "./PlayQueueButton";
import EditButton from "../../../assets/edit.svg?react";
import "../../../styles/details/CollectionDetailActionBar.css";
import DeleteButton from "../../AdminPanel/DeleteButton";
import ModifyButton from "../../AdminPanel/ModifyButton";
import { AuthContext } from "../../auth/AuthProvider";
import SaveButton from "../../AdminPanel/SaveButton";
import { toggleLibraryItem } from "../../Service/LibraryService";
import { apiURL } from "../../../assets/Constants";
import "../../../styles/details/LibraryToggleButton.css";

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
  itemId,
  itemType,
  isOwner = true,
}) => {
  const { userToken, isAdmin, isAuthenticated } = useContext(AuthContext);
  const [isModify, setIsModify] = useState(initialIsModify);
  const [inLibrary, setInLibrary] = useState(false);
  const [toggling, setToggling] = useState(false);

  const switchModify = () => {
    setIsModify(!isModify);
    if (switchParentIsModify) {
      switchParentIsModify();
    }
  };

  // Check initial library state on mount
  useEffect(() => {
    if (!isAuthenticated || !itemId || !itemType) return;
    const checkState = async () => {
      try {
        const res = await fetch(`${apiURL}/library/check?itemId=${itemId}&itemType=${itemType}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setInLibrary(data.inLibrary);
        }
      } catch {}
    };
    checkState();
  }, [itemId, itemType, isAuthenticated, userToken]);

  const handleToggle = async () => {
    if (!isAuthenticated || toggling || !itemId || !itemType) return;
    setToggling(true);
    try {
      const result = await toggleLibraryItem({ userToken, itemId, itemType });
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
            {isAuthenticated && !isOwner && (
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
