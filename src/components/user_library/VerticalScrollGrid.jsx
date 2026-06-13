import React, { useRef, useCallback } from "react";
import VerticalCard from "./VerticalScrollCard";
import "../../styles/library/VerticalScrollGrid.css";
import Library from "../../assets/library.svg?react";
import Cookies from "js-cookie";

const VerticalScrollGrid = ({ title, cards, type, compact, hasMore = true, onLoadMore, loading = false }) => {
  const typeCSS = type === "circle" ? "rounded-full" : "";

  const scrollContainerRef = useRef(null);
  const observerRef = useRef();

  const lastElementCallback = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            onLoadMore?.();
          }
        },
        { root: null, rootMargin: "100px", threshold: 0.1 }
      );
      if (node) observerRef.current.observe(node);
    },
    [onLoadMore, hasMore, loading]
  );

  const renderCards = (isCompact) =>
    cards.map((card, index) => (
      <div
        key={card.id ?? index}
        ref={index === cards.length - 1 ? lastElementCallback : null}
      >
        <VerticalCard
          image={card.image}
          name={card.name}
          subtitle={card.subtitle}
          creator={card.creator}
          typeCSS={typeCSS}
          compact={isCompact}
          itemId={card.itemId}
          itemType={card.itemType}
        />
      </div>
    ));

  return (
    <div className="vertical-scroll-grid">
      {!compact && (
        <div className="vertical-scroll-grid-header">
          <button
            className="w-full flex items-center justify-center"
            onClick={() => {
              const newCompactValue = !compact;
              Cookies.set("compact", newCompactValue, {
                expires: 1,
                sameSite: "Strict",
              });
            }}
          >
            <Library className="svg-library-compact w-[3vw] h-[3vw]" />
          </button>
        </div>
      )}
      {compact && (
        <div className="vertical-scroll-grid-header">
          <button
            className="w-max flex items-center justify-center"
            onClick={() => {
              const newCompactValue = !compact;
              Cookies.set("compact", newCompactValue, {
                expires: 1,
                sameSite: "Strict",
              });
            }}
          >
            <div className="vertical-scroll-card-ui-compact hover:bg-transparent">
              <div className="vertical-scroll-card-content h-auto">
                <div className="vertical-scroll-image-container">
                  <Library className="svg-library-compact" />
                </div>
              </div>
            </div>
          </button>
        </div>
      )}
      <div className="vertical-scroll-grid-container group">
        <div ref={scrollContainerRef} className="vertical-scroll-grid-scroll">
          {renderCards(compact)}
          {loading && (
            <div className="flex justify-center py-3">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerticalScrollGrid;
