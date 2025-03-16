import React from "react";
import ViewAlbum from "./ViewAlbum";

const ViewOnlyAlbum = ({ id, searchTerm, switchModify, queue }) => {
  return (
    <ViewAlbum
      id={id}
      isModify={false}
      searchTerm={searchTerm}
      switchModify={switchModify}
      queue={queue}
    />
  );
};

export default ViewOnlyAlbum;
