import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/library/VerticalScrollCard.css";

const VerticalScrollCard = ({
  image,
  name,
  subtitle,
  creator,
  typeCSS,
  compact,
  itemId,
  itemType,
}) => {
  const navigate = useNavigate();

  const redirect = () => {
    const routeMap = {
      Album: "/album/",
      Artist: "/artist/",
      Playlist: "/playlist/",
    };
    const baseRoute = routeMap[itemType];
    if (baseRoute && itemId) {
      navigate(baseRoute + itemId);
    }
  };

  if (compact) {
    return (
      <div className="vertical-scroll-card-ui-compact" onClick={redirect} style={{ cursor: "pointer" }}>
        <div className="vertical-scroll-card-content-ui-compact">
          <div className="vertical-scroll-image-container">
            <img
              src={image}
              alt={name}
              className={`vertical-scroll-image ${typeCSS}`}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="vertical-scroll-card" onClick={redirect} style={{ cursor: "pointer" }}>
        <div className="vertical-scroll-card-content">
          <div className="vertical-scroll-image-container">
            <img
              src={image}
              alt={name}
              className={`vertical-scroll-image ${typeCSS}`}
            />
          </div>
          <div className="vertical-scroll-text">
            <h3 className="vertical-scroll-name">{name}</h3>
            <p className="vertical-scroll-subtitle">{creator ? `${subtitle} ● ${creator}` : subtitle}</p>
          </div>
        </div>
      </div>
    );
  }
};

export default VerticalScrollCard;
