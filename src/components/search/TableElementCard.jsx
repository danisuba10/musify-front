import React from "react";

import "../../styles/homepage/HorizontalScrollCard.css";

const TableElementCard = ({ image, name, type, typeCSS }) => {
  return (
    <div className="table-card">
      <div className="table-card-content">
        <div className="horizontal-scroll-image-container">
          <img
            src={image}
            alt={name}
            className={`horizontal-scroll-image ${typeCSS}`}
          />
        </div>
        <div className="horizontal-scroll-text">
          <h3 className="horizontal-scroll-name">{name}</h3>
          <p className="horizontal-scroll-subtitle">{type}</p>
        </div>
      </div>
    </div>
  );
};

export default TableElementCard;
