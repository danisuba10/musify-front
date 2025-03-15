import React from "react";

import "../../styles/homepage/HorizontalScrollCard.css";
import { useNavigate } from "react-router-dom";
import NoImage from "../../assets/noImage.jpg";

const HorizontalScrollCard = ({
  id,
  image,
  name,
  subtitle,
  typeCSS,
  route,
  clearSearch,
}) => {
  const navigate = useNavigate();

  const redirect = () => {
    navigate(`${route}${id}`);
    if (clearSearch) {
      clearSearch();
    }
  };

  const handleImageError = (e) => {
    e.target.src = NoImage;
  };

  return (
    <div className="horizontal-scroll-card">
      <div className="horizontal-scroll-card-content">
        <div className="horizontal-scroll-image-container" onClick={redirect}>
          <img
            src={image ?? NoImage}
            alt={name}
            className={`horizontal-scroll-image ${typeCSS}`}
            onError={handleImageError}
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
