import React from "react";

import "../../styles/adminpanel/FormInput.css";

const FormInput = ({ fields, handleSubmit }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    handleSubmit(formData);
  };

  return (
    <>
      <form className="form-container" onSubmit={onSubmit}>
        {fields.map((field, index) => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name} className="form-label">
              {field.label}
            </label>
            {field.displayType === "row" ? (
              <div className="relative flex flex-row gap-2 w-full overflow-x-hidden justify-between pt-1 pb-1 pl-2 pr-2">
                {field.fields.map((subField, subIndex) =>
                  field.type === "file" ? (
                    <input
                      key={subField.name}
                      type="file"
                      name={subField.name}
                      id={subField.name}
                      className="form-input-small"
                      accept={subField.accept || "image/*"}
                      required={subField.required || false}
                    />
                  ) : (
                    <input
                      key={subField.name}
                      type={subField.type}
                      name={subField.name}
                      id={subField.name}
                      className="form-input-small"
                      placeholder={subField.placeholder || ""}
                      required={subField.required || false}
                    />
                  )
                )}
              </div>
            ) : field.type === "file" ? (
              <input
                type="file"
                name={field.name}
                id={field.name}
                className="form-input"
                accept={field.accept || "image/*"}
                required={field.required || false}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                className="form-input"
                placeholder={field.placeholder || ""}
                required={field.required || false}
              />
            )}
          </div>
        ))}
        <button className="form-submit-button" type="submit">
          <span className="submit-button-text">Submit</span>
        </button>
      </form>
    </>
  );
};

export default FormInput;
