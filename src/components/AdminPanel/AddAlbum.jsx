import React, { useContext } from "react";

import FormInput from "./FormInput";
import AddSong from "./AddSong";
import { AuthContext } from "../auth/AuthProvider";
import ModifyAlbum from "./ModifyAlbum";
import { emptyAlbum } from "../../assets/Constants";

const AddAlbum = ({ searchTerm }) => {
  return (
    <>
      <ModifyAlbum isAdd={true} id={null} searchTerm={searchTerm} />
    </>
  );
};

export default AddAlbum;
