import React, { useRef } from "react";
import VerticalCard from "./VerticalScrollCard";
import "../../styles/library/VerticalScrollGrid.css";
import Plus from "../../assets/plus.svg?react";
import RightArrow from "../../assets/arrow.svg?react";
import Library from "../../assets/library.svg?react";
import Cookies from "js-cookie";

const VerticalScrollGrid = ({ title, cards, type, compact }) => {
  const typeCSS = type === "circle" ? "rounded-full" : "";

  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "up" ? -200 : 200;
      container.scrollBy({ top: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="vertical-scroll-grid">
      {!compact && (
        <div className="vertical-scroll-grid-header">
          {/* <h2 className="vertical-scroll-grid-title">{title}</h2> */}
          <button
            onClick={() => {
              const newCompactValue = !compact;
              Cookies.set("compact", newCompactValue, {
                expires: 1,
                sameSite: "Strict",
              });
            }}
          >
            <Library className="library-svg" />
          </button>
          <Plus className="library-svg" />
          <RightArrow className="library-svg" />
        </div>
      )}
      {compact && (
        <div className="vertical-scroll-grid-header">
          <button
            onClick={() => {
              const newCompactValue = !compact;
              Cookies.set("compact", newCompactValue, {
                expires: 1,
                sameSite: "Strict",
              });
            }}
          >
            <div className="vertical-scroll-card-ui-compact">
              <div className="vertical-scroll-card-content">
                <div className="vertical-scroll-image-container">
                  <Library className="svg-library-compact" />
                </div>
              </div>
            </div>
          </button>
        </div>
      )}
      <div className="vertical-scroll-grid-container group">
        {!compact && (
          <div ref={scrollContainerRef} className="vertical-scroll-grid-scroll">
            {cards.map((card, index) => (
              <VerticalCard
                key={index}
                image={card.image}
                name={card.name}
                subtitle={card.subtitle}
                creator={card.creator}
                typeCSS={typeCSS}
              />
            ))}
          </div>
        )}
        {compact && (
          <div ref={scrollContainerRef} className="vertical-scroll-grid-scroll">
            {cards.map((card, index) => (
              <VerticalCard
                key={index}
                image={card.image}
                name={card.name}
                subtitle={card.subtitle}
                creator={card.creator}
                typeCSS={typeCSS}
                image_only={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerticalScrollGrid;
