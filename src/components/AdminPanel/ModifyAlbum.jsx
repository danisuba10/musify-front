import React, { useContext } from "react";

import FormInput from "./FormInput";
import AddSong from "./AddSong";
import { AuthContext } from "../auth/AuthProvider";
import ViewAlbum from "./ViewAlbum";
import { emptyAlbum } from "../../assets/Constants";

const ModifyAlbum = ({ searchTerm }) => {
  return (
    <>
      <ViewAlbum
        id={"147a20f8-36cd-4893-947d-54d8a205052f"}
        searchTerm={searchTerm}
        isModify={true}
      />
    </>
  );
};

export default ModifyAlbum;
