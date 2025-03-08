import React from "react";
import ViewAlbum from "./ViewAlbum";

const ViewOnlyAlbum = ({ id, searchTerm, switchModify }) => {
  return (
    <ViewAlbum
      id={id}
      isModify={false}
      searchTerm={searchTerm}
      switchModify={switchModify}
    />
  );
};

export default ViewOnlyAlbum;
