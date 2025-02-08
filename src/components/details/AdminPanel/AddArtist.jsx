import React from "react";

import FormInput from "./FormInput";

const AddArtist = () => {
  const formFields = [
    { label: "Artist name", name: "artistName", type: "text", required: true },
    {
      label: "Artist image",
      name: "artistImage",
      type: "file",
      required: false,
    },
  ];
  return <FormInput fields={formFields} />;
};

export default AddArtist;
