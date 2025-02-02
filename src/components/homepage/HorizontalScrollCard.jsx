import React from "react";

import "../../styles/homepage/HorizontalScrollCard.css";

const HorizontalScrollCard = ({ image, name, subtitle, typeCSS }) => {
  return (
    <div className="horizontal-scroll-card">
      <div className="horizontal-scroll-card-content">
        <div className="horizontal-scroll-image-container">
          <img
            src={image}
            alt={name}
            className={`horizontal-scroll-image ${typeCSS}`}
          />
        </div>
        <div className="horizontal-scroll-text">
          <h3 className="horizontal-scroll-name">{name}</h3>
          <p className="horizontal-scroll-subtitle">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollCard;
