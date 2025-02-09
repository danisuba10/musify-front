import React from "react";

import "../../styles/homepage/HorizontalScrollCard.css";

const TableElementCard = ({
  id,
  image,
  name,
  type,
  typeCSS,
  selectionFunc,
}) => {
  const redirect = () => {
    window.location.href = `/${type.toLowerCase()}/${id}`;
  };

  return (
    <div className="table-card">
      <div className="table-card-content">
        <div className="horizontal-scroll-image-container" onClick={redirect}>
          <img
            src={image}
            alt={name}
            className={`horizontal-scroll-image ${typeCSS}`}
          />
        </div>
        <div className="horizontal-scroll-text">
          <h3 className="horizontal-scroll-name" onClick={redirect}>
            {name}
          </h3>
          <p className="horizontal-scroll-subtitle">{type}</p>
          <div
            className="border-2 border-svgGrey p-2 rounded-full mt-2"
            onClick={() => selectionFunc({ id, name })}
          >
            <h3 className="horizontal-scroll-name">Select</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableElementCard;
