import React from "react";

import FormInput from "./FormInput";
import AddSong from "./AddSong";

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
      <FormInput fields={formFields} />
      <AddSong />
    </>
  );
};

export default AddAlbum;
