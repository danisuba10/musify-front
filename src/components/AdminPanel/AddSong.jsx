import React from "react";

import FormInput from "./FormInput";

const AddSong = ({ handleSubmit }) => {
  const formFields = [
    { label: "Song name", name: "songName", type: "text", required: true },
    {
      label: "Duration",
      name: "songDuration",
      displayType: "row",
      fields: [
        {
          label: "H",
          placeholder: "Hours",
          name: "songDurationHours",
          type: "text",
          required: false,
        },
        {
          label: "M",
          placeholder: "Minutes",
          name: "songDurationMinutes",
          type: "text",
          required: false,
        },
        {
          label: "S",
          placeholder: "Seconds",
          name: "songDurationSeconds",
          type: "text",
          required: true,
        },
      ],
    },
    {
      label: "Song order in album",
      name: "songOrder",
      type: "text",
      required: true,
    },
  ];

  return <FormInput fields={formFields} handleSubmit={handleSubmit} />;
};

export default AddSong;
