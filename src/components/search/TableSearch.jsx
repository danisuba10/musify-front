import React, { useCallback, useRef } from "react";
import { useState } from "react";

import "../../styles/searchbar/TableSearch.css";
import TableElementCard from "./TableElementCard";

const TableSearch = ({
  title,
  type,
  elements,
  selectionFunc,
  onLoadMore,
  hasMore = true,
  onClickRedir,
}) => {
  const typeCSS = type === "circle" ? "rounded-full" : "";
  const containerRef = useRef(null);

  const observerRef = useRef();

  const lastElementCallback = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            onLoadMore?.();
          }
        },
        {
          root: null,
          rootMargin: "100px",
          treshold: 0.1,
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [onLoadMore, hasMore]
  );

  return (
    <>
      <div className="table-container">
        <div className="table-title">{title}</div>
        <div className="table-container group">
          <div ref={containerRef} className="table-element-container">
            {elements.map((card, index) => (
              <div
                key={index}
                ref={index === elements.length - 1 ? lastElementCallback : null}
              >
                <TableElementCard
                  id={card.id}
                  image={card.image}
                  name={card.name}
                  type={card.subtitle}
                  typeCSS={typeCSS}
                  selectionFunc={selectionFunc}
                  onClickRedir={onClickRedir}
                />
              </div>
            ))}
            {!hasMore && elements.length > 0 && (
              <div className="table-title flex items-center pb-20">
                No more results to load!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TableSearch;
