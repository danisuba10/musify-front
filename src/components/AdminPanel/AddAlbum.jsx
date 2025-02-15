import React, { useContext } from "react";

import FormInput from "./FormInput";
import AddSong from "./AddSong";
import { AuthContext } from "../auth/AuthProvider";
import ModifyAlbum from "./ModifyAlbum";
import { emptyAlbum } from "../../assets/Constants";

const AddAlbum = () => {
  const formFields = [
    {
      label: "Album name",
      name: "albumName",
      type: "text",
      required: true,
    },
    {
      label: "Album image",
      name: "albumImage",
      type: "file",
      required: false,
    },
  ];

  return (
    <>
      {/* <FormInput fields={formFields} />
      <AddSong /> */}
      <ModifyAlbum isAdd={true} />
    </>
  );
};

export default AddAlbum;
