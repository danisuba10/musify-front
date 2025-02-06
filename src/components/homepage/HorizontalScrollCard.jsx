import React from "react";

import "../../styles/homepage/HorizontalScrollCard.css";

const HorizontalScrollCard = ({
  id,
  image,
  name,
  subtitle,
  typeCSS,
  route,
}) => {
  const redirect = () => {
    window.location.href = `${route}${id}`;
  };

  return (
    <div className="horizontal-scroll-card">
      <div className="horizontal-scroll-card-content">
        <div className="horizontal-scroll-image-container" onClick={redirect}>
          <img
            src={image}
            alt={name}
            className={`horizontal-scroll-image ${typeCSS}`}
          />
        </div>
        <div className="horizontal-scroll-text">
          <h3
            className="horizontal-scroll-name"
            onClick={route ? redirect : null}
          >
            {name}
          </h3>
          <p className="horizontal-scroll-subtitle">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollCard;
