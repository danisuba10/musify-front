import React, { useEffect, useRef, useState } from "react";
import ArtistCard from "./HorizontalScrollCard";
import "../../styles/homepage/HorizontalScrollGrid.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { search } from "../search/SearchFetches";
import { apiURL } from "../../assets/Constants";

const HorizontalScrollGrid = ({
  title,
  url,
  subtitle,
  type,
  route,
  initialElements,
}) => {
  const [elements, setElements] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (initialElements) {
        setElements(initialElements);
        return;
      }

      console.log("Fetching data with URL: ", url);
      try {
        const result = await search({
          setSearchDisplay: null,
          term: "",
          endPoint: url,
          rounded: type === "circle",
          title: "",
          setLastFoundCreatedAt: null,
          setLastFoundName: null,
          lastName: "",
          lastCreatedAt: "",
          selectionFunc: null,
        });
        console.log("Fetch result: ", result);
        setElements(result || []);
      } catch (error) {
        console.error("Error fetching elements:", error);
        setElements([]);
      }
    };
    fetchData();
  }, [url]);

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
          {elements &&
            elements.map((element, index) => (
              <ArtistCard
                key={index}
                id={element.id}
                image={element.image}
                name={element.name}
                subtitle={subtitle}
                typeCSS={typeCSS}
                route={route}
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
