import React, { useRef } from "react";
import ArtistCard from "./HorizontalScrollCard";
import "../../styles/homepage/HorizontalScrollGrid.css";

const HorizontalScrollGrid = ({ title, artists, type }) => {
  const typeCSS = type === "circle" ? "rounded-full" : "";

  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="horizontal-scroll-grid">
      <div className="horizontal-scroll-grid-header">
        <h2 className="horizontal-scroll-grid-title">{title}</h2>
      </div>
      <div className="horizontal-scroll-grid-container group">
        <div ref={scrollContainerRef} className="horizontal-scroll-grid-scroll">
          {artists.map((artist, index) => (
            <ArtistCard
              key={index}
              image={artist.image}
              name={artist.name}
              subtitle={artist.subtitle}
              typeCSS={typeCSS}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollGrid;
