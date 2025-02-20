import React, { useContext } from "react";

import FormInput from "./FormInput";
import AddSong from "./AddSong";
import { AuthContext } from "../auth/AuthProvider";
import ViewAlbum from "./ViewAlbum";
import { emptyAlbum } from "../../assets/Constants";

const AddAlbum = ({ searchTerm }) => {
  return (
    <>
      <ViewAlbum isAdd={true} id={null} searchTerm={searchTerm} />
    </>
  );
};

export default AddAlbum;
