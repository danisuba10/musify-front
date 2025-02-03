import React from "react";

import "../../styles/library/VerticalScrollCard.css";

const VerticalScrollCard = ({
  image,
  name,
  subtitle,
  creator,
  typeCSS,
  image_only,
}) => {
  return (
    <div className="vertical-scroll-card">
      <div className="vertical-scroll-card-content">
        <div className="vertical-scroll-image-container">
          <img
            src={image}
            alt={name}
            className={`vertical-scroll-image ${typeCSS}`}
          />
        </div>
        {!image_only && (
          <div className="vertical-scroll-text">
            <h3 className="vertical-scroll-name">{name}</h3>
            <p className="vertical-scroll-subtitle">{`${subtitle} ● ${creator}`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerticalScrollCard;
