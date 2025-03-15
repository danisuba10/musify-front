import React, { useState, useEffect, useContext, memo } from "react";
import ModifyAlbum from "./ModifyAlbum";
import ViewOnlyAlbum from "./ViewOnlyAlbum";
import ViewAlbum from "./ViewAlbum";
import { AuthContext } from "../auth/AuthProvider";

const Album = ({
  searchTerm,
  id,
  setSearchPopupAllowed,
  isModify,
  setIsModify,
  setCurrentSongId,
}) => {
  const { isAdmin } = useContext(AuthContext);

  const switchModify = () => {
    if (!isAdmin()) {
      setIsModify(false);
      return;
    }
    setIsModify(!isModify);
  };

  useEffect(() => {
    if (isModify) {
      setSearchPopupAllowed(false);
    } else {
      setSearchPopupAllowed(true);
    }
  }, [isModify]);

  return isModify ? (
    <ViewAlbum
      id={id}
      searchTerm={searchTerm}
      isModify={true}
      switchModify={switchModify}
      setCurrentSongId={setCurrentSongId}
    />
  ) : (
    <ViewOnlyAlbum
      id={id}
      searchTerm={searchTerm}
      switchModify={switchModify}
      setCurrentSongId={setCurrentSongId}
    />
  );
};

export default Album;
