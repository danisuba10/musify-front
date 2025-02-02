import React, { useRef } from "react";
import VerticalCard from "./VerticalScrollCard";
import "../../styles/library/VerticalScrollGrid.css";
import Plus from "../../assets/plus.svg?react";
import RightArrow from "../../assets/arrow.svg?react";

const VerticalScrollGrid = ({ title, cards, type }) => {
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
      <div className="vertical-scroll-grid-header">
        <h2 className="vertical-scroll-grid-title">{title}</h2>
        <Plus className="library-svg" />
        <RightArrow className="library-svg" />
      </div>
      <div className="vertical-scroll-grid-container group">
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
      </div>
    </div>
  );
};

export default VerticalScrollGrid;
