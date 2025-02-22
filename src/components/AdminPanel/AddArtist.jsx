import React, { useContext, useState } from "react";

import FormInput from "./FormInput";
import { AuthContext } from "../auth/AuthProvider";
import { apiURL } from "../../assets/Constants";

const AddArtist = () => {
  const { userToken } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      const response = await fetch(`${apiURL}/artist/add-artist`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        setSuccessMessage("Artist added successfully!");
        console.log("Artist added successfully!");
      } else {
        setErrorMessage("Error adding artist!");
        console.error("Error adding artist");
        console.log(response);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <div className="flex flex-col w-full h-full overflow-y-auto items-center justify-center gap-4">
      {successMessage && (
        <div className="border-2 border-green-500 rounded-3xl p-3">
          <span className="text-white font-bold text-xl">{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="border-2 border-orange-500 rounded-3xl p-3">
          <span className="text-white font-bold text-xl">{errorMessage}</span>
        </div>
      )}
      <FormInput fields={formFields} handleSubmit={handleSubmit} />
    </div>
  );
};

export default AddArtist;
