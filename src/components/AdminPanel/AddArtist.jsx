import React, { useContext } from "react";

import FormInput from "./FormInput";
import { AuthContext } from "../auth/AuthProvider";

const AddArtist = () => {
  const formFields = [
    { label: "Artist name", name: "Name", type: "text", required: true },
    {
      label: "Artist image",
      name: "FormFile",
      type: "file",
      required: false,
    },
  ];

  const handleSubmit = async (formData) => {
    const userToken = useContext(AuthContext);
    try {
      // Log the form data content
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      const response = await fetch("http://localhost:5231/artist/add-artist", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        console.log("Artist added successfully!");
      } else {
        console.error("Error adding artist");
        console.log(response);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return <FormInput fields={formFields} handleSubmit={handleSubmit} />;
};

export default AddArtist;
