import React, { useEffect, useRef, useState } from "react";
import ArtistCard from "./HorizontalScrollCard";
import "../../styles/homepage/HorizontalScrollGrid.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HorizontalScrollGrid = ({ title, artists, type }) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const typeCSS = type === "circle" ? "rounded-full" : "";

  const scrollContainerRef = useRef(null);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

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
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="scroll-button left"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

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
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="scroll-button right"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default HorizontalScrollGrid;
