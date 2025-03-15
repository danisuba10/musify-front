import React from "react";
import ViewAlbum from "./ViewAlbum";

const ViewOnlyAlbum = ({ id, searchTerm, switchModify, setCurrentSongId }) => {
  return (
    <ViewAlbum
      id={id}
      isModify={false}
      searchTerm={searchTerm}
      switchModify={switchModify}
      setCurrentSongId={setCurrentSongId}
    />
  );
};

export default ViewOnlyAlbum;
